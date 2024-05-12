import { order$ } from '$lib/client/schemas/index.js';
import edit from '$lib/server/actions/orders/edit';
import { db } from '$lib/server/db';

import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error } from '@sveltejs/kit';
import type { Optional } from '$types/UtilityTypes.js';
import { interpret } from 'xstate';
import { orderMachine } from '$lib/client/machines/orderStatus';

export const load = async ({ params }) => {
	const { orderId } = params;
	const order = await db.query.ordersTable.findFirst({
		where: (orders, { eq }) => eq(orders.id, orderId),
		columns: {
			id: true,
			price: true,
			discount: true,
			status: true,
			estimatedDeliveryDate: true,
			deliveryMethod: true,
			paymentMethod: true,
			createdAt: true,
			paid: true
		},
		with: {
			products: {
				columns: {
					quantity: true,
					productId: true
				},
				with: {
					product: {
						columns: {
							id: true,
							symbol: true,
							name: true,
							encodedURL: true,
							price: true
						}
					}
				}
			},
			cartOwner: {
				columns: {
					id: true,
					fullName: true,
					email: true
				}
			},
			customer: {
				columns: {
					id: true,
					fullName: true,
					email: true
				}
			},
			address: {
				columns: {
					street: true,
					zipCode: true,
					city: true
				}
			}
		}
	});

	if (!order) {
		error(404, {
			message: 'Nie znaleziono zamówienia'
		});
	}

	const service = interpret(orderMachine).onTransition(async (state) => {
		console.log('Transitioned ->', state.value, state.context);
	});
	service.start(order.status);
	const serviceSnapshot = service.getSnapshot();
	const possibleEvents = serviceSnapshot.nextEvents;

	const defaultOrderValues = {
		id: order.id,
		event: possibleEvents.length ? possibleEvents[0] : undefined
	};

	console.log('defaultOrderValues', defaultOrderValues, order.status);

	return {
		order,
		form: await superValidate(defaultOrderValues, zod(order$.editForm))
	};
};

export const actions = {
	edit
};
