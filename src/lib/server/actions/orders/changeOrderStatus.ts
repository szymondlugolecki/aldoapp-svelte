import getCustomError from '$lib/client/constants/customErrors';
// import { p } from '$lib/server/clients/pClient';
import { trytm } from '@bdsqqq/try';
import { error, type Action, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { isAtLeastModerator } from '$lib/client/functions';
import { orderMachine } from '$lib/client/machines/orderStatus';
import { interpret } from 'xstate';
import type { OrderStatus } from '$lib/client/constants/dbTypes';
import { ordersTable } from '$lib/server/db/schemas/orders';
import { eq } from 'drizzle-orm';
import { order$ } from '$lib/client/schemas';
import {
	orderStatusEmailDescription,
	orderStatusEmailPreview
} from '$lib/server/constants/messages';
import { setError, setMessage, superValidate, fail } from 'sveltekit-superforms';
import { sendOrderStatusEmail } from '$lib/server/clients/resend';
import { orderStatusLogsTable } from '$lib/server/db/schemas/orderStatusLogs';
import { zod } from 'sveltekit-superforms/adapters';

/*

 1. Fetch the order to get the status and paid status
 2. Check if the user is allowed to change the status
 3. Change the status

*/

const changeOrderStatus = (async ({ request, locals }) => {
	const sessionUser = locals.user;

	// ! THIS IS REMOVED FOR NOW:
	// Only moderators and admins are allowed to change order status
	// BUT
	// if state=awaitingCustomerDecision then the user
	// can cancel the order (items are unavailable)

	if (!sessionUser) {
		redirect(303, '/zaloguj');
		// error(...getCustomError('not-logged-in'));;
	}
	if (!isAtLeastModerator(sessionUser.role)) {
		error(...getCustomError('insufficient-permissions'));
	}

	const form = await superValidate(request, zod(order$.eventForm));
	if (!form.valid) {
		return fail(400, { form });
	}

	// Validate the user input
	const { event, id } = form.data;
	const [oldOrder, getPrevOrderStatusError] = await trytm(
		db.query.ordersTable.findFirst({
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
		return setError(form, 'event', 'Bład serwera podczas szukania zamówienia', { status: 500 });
	}

	if (!oldOrder) {
		// Unexpected-error
		console.error('no error but theres no previous order status O.o', oldOrder);
		return setError(form, 'event', 'Nie znaleziono zamówienia', { status: 400 });
	}

	// Check if the user is allowed to change the status
	// Only mods are allowed to change the status in general
	// But if the status is awaitingCustomerDecision then the user can either:
	// 1. Cancel the order
	// 2. Keep waiting for the products to be available

	// if (!isAtLeastModerator(sessionUser.role)) {
	// 	// Not a moderator
	// 	// Can only change the status if the order status is awaitingCustomerDecision
	// 	// And they are editing their own order
	// 	const awaitingCustomerDecision = oldOrder.status === 'awaitingCustomerDecision';
	// 	const editingItsOwnOrder = oldOrder.customerId === sessionUser.id;
	// 	if (!awaitingCustomerDecision || !editingItsOwnOrder) {
	// 		throw error(...getCustomError('insufficient-permissions'));
	// 	}
	// }

	// Restore the machine
	const service = interpret(orderMachine).onTransition(async (state) => {
		console.log('Transitioned ->', state.value, state.context);
	});
	service.start(oldOrder.status);
	const serviceSnapshot = service.getSnapshot();
	// const possibleEvents = serviceSnapshot.nextEvents;

	// Check if event is possible
	if (!serviceSnapshot.can(event)) {
		console.log('Next Events ->', serviceSnapshot.nextEvents);
		return setError(form, 'event', 'Nieprawidłowy status zamówienia', { status: 400 });
	}

	console.log('\n\n\n', 'event', event);
	console.log('Next Events ->', serviceSnapshot.nextEvents);

	// Event is possible, update the machine
	service.send(event);
	const currentState = service.getSnapshot().value as OrderStatus;

	console.log('changing the status from', oldOrder.status, 'to', currentState);

	// Update the order
	const [, editOrderError] = await trytm(
		db.batch([
			db
				.update(ordersTable)
				.set({
					status: currentState
				})
				.where(eq(ordersTable.id, id)),
			db.insert(orderStatusLogsTable).values({
				orderId: id,
				event,
				userId: sessionUser.id
			})
		])
	);

	if (editOrderError) {
		// Unexpected-error
		console.error('editOrderError', editOrderError);
		return setError(form, 'event', 'Błąd serwera podczas zmieniania statusu zamówienia', {
			status: 500
		});
	}

	// Send push notifications
	// try {
	// 	sendNotifications(oldOrder.customer.subscriptions, getOrderStatusPushMessage(event));
	// } catch (error) {
	// 	console.error('sendNotifications error', error);
	// }

	// Send emails
	const orderDate = oldOrder.createdAt.toLocaleString('pl-PL', {
		timeZone: 'Europe/Warsaw',
		month: 'long',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		year: 'numeric'
	});

	const orderedByAdvisorForCustomer = oldOrder.customer.id !== oldOrder.cartOwner.id;

	// ! sending the email to the adviser for now
	const [, sendEmailError] = await trytm(
		sendOrderStatusEmail({
			to: [oldOrder.cartOwner.email],
			from: 'Zamówienia <admin@twojealdo.pl>',
			props: {
				orderId: oldOrder.id,
				time: orderDate,
				price: oldOrder.price,
				description: orderStatusEmailDescription(event),
				preview: orderStatusEmailPreview(event),
				firstName: oldOrder.customer.fullName.split(' ')[0],
				cartOwner: orderedByAdvisorForCustomer ? oldOrder.cartOwner : null,
				driver: oldOrder.driver || null
			}
		})
	);

	if (sendEmailError) {
		// Unexpected-error
		return setError(
			form,
			'event',
			'Błąd serwera. Status został zmieniony, ale nie udało się wysłać emaila z powiadomieniem.',
			{
				status: 500
			}
		);
	}

	return setMessage(form, 'Zaktualizowano status zamówienia');
}) satisfies Action;

export default changeOrderStatus;
