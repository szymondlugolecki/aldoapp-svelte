// import { p } from '$lib/server/clients/pClient';
import { error, type Action, redirect } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import getCustomError from '$lib/client/constants/customErrors';
import { isAtLeastModerator } from '$lib/client/functions';
import { order$, products$ } from '$lib/client/schemas';
import { setError, setMessage, superValidate, fail } from 'sveltekit-superforms';
import { productsTable, type SelectProduct } from '$lib/server/db/schemas/products';
import { eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { env } from '$env/dynamic/private';
import { zod } from 'sveltekit-superforms/adapters';
import { ordersTable, type SelectOrder } from '$lib/server/db/schemas/orders';
import { orderStatusLogsTable } from '$lib/server/db/schemas/orderStatusLogs';
import { interpret } from 'xstate';
import { orderMachine } from '$lib/client/machines/orderStatus';
import type { OrderStatus } from '$lib/client/constants/dbTypes';
import { orderAddressTable } from '$lib/server/db/schemas/orderAddress';

const edit: Action = async ({ request, locals }) => {
	const sessionUser = locals.user;
	// Must be a moderator or higher
	if (!sessionUser) {
		redirect(303, '/zaloguj');
	}

	if (!isAtLeastModerator(sessionUser.role)) {
		error(...getCustomError('insufficient-permissions'));
	}

	const form = await superValidate(request, zod(order$.editForm));
	if (!form.valid) return fail(400, { form });

	// Make sure something else other than id was provided
	if (Object.keys(form.data).length <= 1) {
		return setError(form, 'id', 'Nie podano żadnych danych do edycji', { status: 400 });
	}

	const { id, event, city, zipCode, street } = form.data;

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

	// Event is possible, update the machine
	service.send(event);
	const newStatus = service.getSnapshot().value as OrderStatus;

	const addressProvided = Boolean(city || zipCode || street);

	let batchQueries: Parameters<(typeof db)['batch']>[0] = [
		db
			.update(ordersTable)
			.set({
				status: newStatus
			})
			.where(eq(ordersTable.id, id)),
		db.insert(orderStatusLogsTable).values({
			orderId: id,
			event,
			userId: sessionUser.id
		})
	];

	if (addressProvided) {
		batchQueries = [
			...batchQueries,
			db
				.update(orderAddressTable)
				.set({
					city,
					street,
					zipCode
				})
				.where(eq(orderAddressTable.orderId, id))
		];
	}

	// Edit the product in the db
	const [, editOrderError] = await trytm(db.batch(batchQueries));

	if (editOrderError) {
		// Unexpected-error
		console.error('editOrderError', editOrderError);
		return setError(form, 'id', 'Błąd serwera podczas zmieniania statusu zamówienia', {
			status: 500
		});
	}

	redirect(303, `/admin/zamowienia`);
};

export default edit;
