import getCustomError from '$lib/client/constants/customErrors';
// import { p } from '$lib/server/clients/pClient';
import { trytm } from '@bdsqqq/try';
import { error, fail, type Action } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { isAtLeastModerator } from '$lib/client/functions';
import { orderMachine } from '$lib/client/machines/orderStatus';
import { interpret } from 'xstate';
import type { OrderStatus } from '$lib/client/constants/dbTypes';
import { orders } from '$lib/server/db/schemas/orders';
import { eq } from 'drizzle-orm';
import { order$ } from '$lib/client/schemas';
import { sendNotifications } from '$lib/server/functions/push';
import {
	getOrderStatusPushMessage,
	orderStatusEmailDescription,
	orderStatusEmailPreview
} from '$lib/server/constants/messages';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';
import { sendOrderStatusEmail } from '$lib/server/clients/resend';

/*

 1. Fetch the order to get the status and paid status
 2. Check if the user is allowed to change the status
 3. Change the status

*/

const changeOrderStatus = (async ({ request, locals }) => {
	const sessionUser = locals.session?.user;

	// Only moderators and admins are allowed to change order status
	// ! BUT
	// if state=awaitingCustomerDecision then the user
	// can cancel the order (items are unavailable)

	if (!sessionUser) {
		throw error(...getCustomError('not-logged-in'));
	}
	const form = await superValidate(request, order$.eventForm);
	if (!form.valid) {
		return fail(400, { form });
	}

	// Validate the user input
	const { event, id } = form.data;
	const [previousOrder, getPrevOrderStatusError] = await trytm(
		db.query.orders.findFirst({
			where: (orders, { eq }) => eq(orders.id, id),
			columns: {
				id: true,
				status: true,
				paid: true,
				customerId: true,
				createdAt: true,
				price: true
			},
			with: {
				customer: {
					columns: {
						id: true,
						fullName: true,
						email: true
					},
					with: {
						subscriptions: {
							columns: {
								endpoint: true,
								keys: true,
								expirationTime: true
							}
						}
					}
				},
				cartOwner: {
					columns: {
						id: true,
						fullName: true,
						email: true,
						phone: true
					}
				},
				driver: {
					columns: {
						id: true,
						fullName: true,
						email: true,
						phone: true
					}
				}
			}
		})
	);

	if (getPrevOrderStatusError) {
		// Unexpected-error
		console.error('getPrevOrderStatusError', getPrevOrderStatusError);
		return setError(form, 'event', 'Nie udało się zmienić statusu zamówienia', { status: 500 });
	}

	if (!previousOrder) {
		// Unexpected-error
		console.error('no error but theres no previous order status O.o', previousOrder);
		return setError(form, 'event', 'Nie znaleziono zamówienia', { status: 500 });
	}

	// Check if the user is allowed to change the status
	// Only mods are allowed to change the status in general
	// But if the status is awaitingCustomerDecision then the user can either
	// 1. Cancel the order
	// 2. Keep waiting for the products to be available

	if (!isAtLeastModerator(sessionUser.role)) {
		// Not a moderator
		// Can only change the status if the order status is awaitingCustomerDecision
		// And they are editing their own order
		const awaitingCustomerDecision = previousOrder.status === 'awaitingCustomerDecision';
		const editingItsOwnOrder = previousOrder.customerId === sessionUser.id;
		if (!awaitingCustomerDecision || !editingItsOwnOrder) {
			throw error(...getCustomError('insufficient-permissions'));
		}
	}

	// Restore the machine
	const service = interpret(orderMachine).onTransition(async (state) => {
		console.log('Transitioned ->', state.value, state.context);
	});
	service.start(previousOrder.status);
	const serviceSnapshot = service.getSnapshot();
	// const possibleEvents = serviceSnapshot.nextEvents;

	// Check if event is possible
	if (!serviceSnapshot.can(event)) {
		console.log('Next Events ->', serviceSnapshot.nextEvents);
		return setError(form, 'event', 'Nieprawidłowy status zamówienia', { status: 400 });
	}

	// Event is possible, update the machine
	service.send(event);
	const currentState = service.getSnapshot().value as OrderStatus;

	// Update the order
	const [, editOrderError] = await trytm(
		db
			.update(orders)
			.set({
				status: currentState
			})
			.where(eq(orders.id, id))
	);

	if (editOrderError) {
		// Unexpected-error
		console.error('editOrderError', editOrderError);
		return setError(form, 'event', 'Nie udało się zmienić statusu zamówienia', { status: 500 });
	}

	// Send push notifications
	sendNotifications(previousOrder.customer.subscriptions, getOrderStatusPushMessage(event));

	// Send emails
	const orderDate = previousOrder.createdAt.toLocaleString('pl-PL', {
		timeZone: 'Europe/Warsaw',
		month: 'long',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		year: 'numeric'
	});

	const orderedByAdvisorForCustomer = previousOrder.customer.id !== previousOrder.cartOwner.id;

	const [, sendEmailError] = await trytm(
		sendOrderStatusEmail({
			to: [previousOrder.customer.email],
			props: {
				orderId: previousOrder.id,
				time: orderDate,
				price: previousOrder.price,
				description: orderStatusEmailDescription(event),
				preview: orderStatusEmailPreview(event),
				firstName: previousOrder.customer.fullName.split(' ')[0],
				cartOwner: orderedByAdvisorForCustomer ? previousOrder.cartOwner : null,
				driver: previousOrder.driver || null
			}
		})
	);

	if (sendEmailError) {
		// Unexpected-error
		return setError(
			form,
			'event',
			'Błąd podczas wysyłania emaila o zmianie statusu. Spróbuj ponownie',
			{ status: 500 }
		);
	}

	return setMessage(form, 'Zaktualizowano status zamówienia');
}) satisfies Action;

export default changeOrderStatus;
