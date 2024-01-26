import getCustomError from '$lib/client/constants/customErrors.js';
import { isAtLeastModerator } from '$lib/client/functions';
import { order$ } from '$lib/client/schemas/index.js';
import changeOrderStatus from '$lib/server/actions/orders/changeOrderStatus';
import orderAgain from '$lib/server/actions/orders/orderAgain';
import { db } from '$lib/server/db/index.js';
import { trytm } from '@bdsqqq/try';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async ({ params, locals }) => {
	const sessionUser = locals.session?.user;
	if (!sessionUser) {
		error(...getCustomError('not-logged-in'));
	}

	const isMod = isAtLeastModerator(sessionUser.role);

	const [rawOrder, fetchOrderError] = await trytm(
		db.query.orders.findFirst({
			columns: {
				id: true,
				createdAt: true,
				status: true,
				paid: true,
				price: true,
				discount: true,
				deliveryMethod: true,
				paymentMethod: true
			},
			with: {
				cartOwner: {
					columns: {
						id: true,
						fullName: true,
						email: true,
						phone: true,
						role: true
					}
				},
				customer: {
					columns: {
						id: true,
						fullName: true,
						email: true,
						phone: true
					},
					with: {
						address: {
							columns: {
								street: true,
								city: true,
								zipCode: true
							}
						}
					}
				},
				products: {
					columns: {
						price: true,
						quantity: true
					},
					with: {
						product: {
							columns: {
								id: true,
								name: true,
								symbol: true,
								encodedURL: true,
								description: true
							}
						}
					}
				},
				driver: {
					columns: {
						id: true,
						fullName: true,
						email: true,
						phone: true
					}
				},
				address: {
					columns: {
						street: true,
						city: true,
						zipCode: true
					}
				}
			},
			where: (orders, { eq }) => eq(orders.id, Number(params.orderId))
		})
	);

	if (fetchOrderError) {
		// Unexpected-error
		console.log('fetchOrderError', fetchOrderError);
		error(500, 'Niespodziewany błąd podczas szukania zamówienia');
	}

	if (!rawOrder) {
		error(404, 'Nie znaleziono zamówienia');
	}

	// Check permissions
	const isOwner = rawOrder.cartOwner.id === sessionUser.id;
	if (!isOwner && !isMod) {
		error(...getCustomError('insufficient-permissions'));
	}

	console.log('rawOrder', rawOrder.products.length, rawOrder.products[0]);

	const order = {
		...rawOrder,
		products: rawOrder.products.map(({ product, quantity, price }) => ({
			...product,
			price,
			quantity
		}))
	};

	console.log('cooked ordered', order);

	// Fetch the status logs history
	const [statusHistory, getStatusHistoryError] =
		sessionUser.role === 'admin'
			? await trytm(
					db.query.orders.findFirst({
						where: (orders, { eq }) => eq(orders.id, Number(params.orderId)),
						columns: {
							id: true
						},
						with: {
							statusLogs: {
								orderBy: (logs, { desc }) => desc(logs.timestamp),
								columns: {
									event: true,
									timestamp: true
								},
								with: {
									user: {
										columns: {
											id: true,
											fullName: true
										}
									}
								}
							}
						}
					})
			  )
			: [null, null];

	if (getStatusHistoryError) {
		// Unexpected-error
		console.error('getStatusHistoryError', getStatusHistoryError);
		error(500, 'Nie udało się pobrać historii statusu zamówienia');
	}

	return {
		order,
		orderAgainForm: await superValidate(order$.orderAgainForm),
		orderStatusHistoryForm: await superValidate(order$.orderStatusHistoryForm),
		statusHistory
	};
};

export const actions = {
	changeOrderStatus,
	orderAgain
};
