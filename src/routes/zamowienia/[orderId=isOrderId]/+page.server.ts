import { isAtLeastModerator } from '$lib/client/functions';
import { db } from '$lib/server/db/index.js';
import type { OrderSummary } from '$types';
import { trytm } from '@bdsqqq/try';
import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	const sessionUser = locals.session?.user;
	// In order to see order details, user must be:
	// 1. logged in
	// 2a. must be the owner of the order
	// 2b. must be a mod

	if (!sessionUser) {
		throw error(401, 'Nie jesteś zalogowany');
	}

	const isMod = isAtLeastModerator(sessionUser.role);

	const [preParseOrder, fetchOrderError] = await trytm(
		db.query.orders.findFirst({
			columns: {
				id: true,
				createdAt: true,
				updatedAt: true,

				status: true,
				paymentStatus: true,
				deliveryStatus: true,

				deliveryMethod: true,
				paymentMethod: true,

				address: true,

				price: true,
				discount: true,
				noDiscountPrice: true
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
						phone: true,
						address: true
					}
				},
				orderProducts: {
					with: {
						product: {
							columns: {
								id: true,
								name: true,
								symbol: true,
								price: true,
								encodedURL: true
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
				}
			},
			where: (orders, { eq }) => eq(orders.id, Number(params.orderId))
		})
	);

	if (fetchOrderError) {
		// Unexpected-error
		console.log('fetchOrderError', fetchOrderError);
		throw error(500, 'Wystąpił niespodziewany błąd podczas szukania zamówienia');
	}

	if (!preParseOrder) {
		throw error(404, 'Nie znaleziono zamówienia');
	}

	// Check permissions
	const isOwner = preParseOrder.cartOwner.id === sessionUser.id;
	if (!isOwner) {
		if (!isMod) {
			throw error(403, 'Nie masz wystarczających uprawień, żeby zobaczyć te zamówienie');
		}
	}

	const {
		id,
		address,
		paymentMethod,
		paymentStatus,
		deliveryMethod,
		deliveryStatus,
		status,
		createdAt,
		updatedAt,
		price,
		discount,
		noDiscountPrice,
		customer,
		cartOwner,
		driver
	} = preParseOrder;

	console.log('preParseOrder', preParseOrder.orderProducts.length, preParseOrder.orderProducts[0]);

	const order: OrderSummary = {
		products: preParseOrder.orderProducts.map(({ product, quantity }) => ({
			...product,
			quantity
		})),
		id,
		address,
		paymentMethod,
		paymentStatus,
		deliveryMethod,
		deliveryStatus,
		status,
		createdAt,
		updatedAt,
		price,
		discount,
		noDiscountPrice,
		customer,
		cartOwner,
		driver
	};

	return {
		order
	};
};
