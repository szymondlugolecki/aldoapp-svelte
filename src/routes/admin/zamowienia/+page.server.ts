import { db } from '$lib/server/db';
import type { OrderSortableColumn } from '$types';
import { sql } from 'drizzle-orm';
import { ordersTable } from '$lib/server/db/schemas/orders.js';
import { extractParams } from '$lib/server/functions/utils';
import changeOrderStatus from '$lib/server/actions/orders/changeOrderStatus';
import changePaymentStatus from '$lib/server/actions/orders/changeOrderPaymentStatus.js';
import changeOrderAddress from '$lib/server/actions/orders/changeOrderAddress.js';
import { superValidate } from 'sveltekit-superforms/server';
import { order$ } from '$lib/client/schemas';

const sortableColumns: OrderSortableColumn[] = [
	'status',
	'deliveryMethod',
	'price',
	'estimatedDeliveryDate',
	'createdAt'
];

const pageLimit = 10;

export const load = async ({ url }) => {
	const { page, sort } = extractParams<OrderSortableColumn>(url, sortableColumns);

	console.log('page', page, sort);

	return {
		orders: await db.query.ordersTable.findMany({
			limit: pageLimit,
			offset: (page - 1) * pageLimit,
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
			},
			orderBy: sort
				? (orders, { asc, desc }) =>
						sort.descending ? desc(orders[sort.by]) : asc(orders[sort.by])
				: (orders, { desc }) => desc(orders.createdAt)
		}),
		count: await db
			.select({
				count: sql<number>`count(*)`.mapWith(Number)
			})
			.from(ordersTable),
		pageLimit,
		eventForm: await superValidate(order$.eventForm),
		paymentForm: await superValidate(order$.paymentForm),
		addressForm: await superValidate(order$.orderAddressForm)
	};
};

export const actions = {
	changeOrderStatus,
	changePaymentStatus,
	changeOrderAddress
};
