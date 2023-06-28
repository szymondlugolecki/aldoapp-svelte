import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schemas/users';
import type { OrderSortableColumn } from '$types';
import { sql } from 'drizzle-orm';
import { isJSON } from '$lib/client/functions';

const sortableColumns: OrderSortableColumn[] = [
	'status',
	'paymentStatus',
	'deliveryStatus',
	'deliveryMethod',
	'deliveryStatus',
	'price',
	'estimatedDeliveryDate',
	'createdAt'
];

const pageLimit = 10;

export const load = ({ url }) => {
	const page = !isNaN(Number(url.searchParams.get('strona')))
		? Math.max(Number(url.searchParams.get('strona')), 1)
		: 1;

	const sort = url.searchParams.get('sort');
	const desc = url.searchParams.get('desc');

	const descBool = desc && ['true', 'false'].includes(desc) ? isJSON<boolean>(desc) : null;
	const properSort = (sort: string | null): sort is OrderSortableColumn => {
		return !!sort && sortableColumns.includes(sort as OrderSortableColumn);
	};

	console.log('page', page, sort, 'desc', descBool);

	return {
		orders: db.query.orders.findMany({
			with: {
				orderProducts: {
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
				}
			},
			columns: {
				id: true,
				price: true,
				discount: true,
				status: true,
				paymentStatus: true,
				deliveryStatus: true,
				address: true,
				estimatedDeliveryDate: true,
				deliveryMethod: true,
				paymentMethod: true,
				createdAt: true
			},
			offset: (page - 1) * pageLimit,
			...(descBool !== null && properSort(sort)
				? {
						orderBy: (orders, { asc, desc }) => (descBool ? desc(orders[sort]) : asc(orders[sort]))
				  }
				: {}),
			limit: pageLimit
		}),
		count: db
			.select({
				count: sql<number>`count(*)`.mapWith(Number)
			})
			.from(users),
		pageLimit
	};

	// return {
	// 	// fetch with products in the future
	// 	// when i find out how to do it
	// 	orders: db
	// 		.select({
	// 			order: orders,
	// 			attachedCustomer: {
	// 				id: users.id,
	// 				fullName: users.fullName,
	// 				email: users.email
	// 			},
	// 			attachedDriver: {
	// 				id: drivers.id,
	// 				fullName: drivers.fullName,
	// 				email: drivers.email
	// 			}
	// 			// productsList: {
	// 			// 	id: products.id,
	// 			// 	symbol: products.symbol,
	// 			// 	name: products.name,
	// 			// 	encodedURL: products.encodedURL
	// 			// }
	// 		})
	// 		.from(orders)
	// 		.orderBy(desc(orders.createdAt))
	// 		.limit(3)
	// 		.leftJoin(users, eq(orders.customerId, users.id))
	// 		.leftJoin(drivers, eq(drivers.id, orders.driverId)),
	// 	promise: {
	// 		// order it by updatedAt once drizzle/planetscale supports it
	// 		orders: db
	// 			.select({
	// 				order: orders,
	// 				attachedCustomer: {
	// 					id: users.id,
	// 					fullName: users.fullName,
	// 					email: users.email
	// 				},
	// 				attachedDriver: {
	// 					id: drivers.id,
	// 					fullName: drivers.fullName,
	// 					email: drivers.email
	// 				}
	// 			})
	// 			.from(orders)
	// 			.orderBy(desc(orders.createdAt))
	// 			.limit(999_999)
	// 			.offset(3)
	// 			.leftJoin(users, eq(orders.customerId, users.id))
	// 			.leftJoin(drivers, eq(drivers.id, orders.driverId))
	// 	}
	// };
};

// export const actions = {
// 	add,
// 	edit
// };
