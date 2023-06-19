import { db } from '$lib/server/db';
import type { Order } from '$types';
import type { Optional } from '$types/UtilityTypes.js';
import { error, json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export async function GET({ url }) {
	const page = Number(url.searchParams.get('page')) || 1;
	// const search = url.searchParams.get('search');

	console.log('api/orders/list', page);

	const data = await db.query.orders.findMany({
		extras: {
			count: sql<number>`count(*)`.as('count')
		},
		limit: 20,
		offset: 20 * (page - 1),
		with: {
			promoCode: true,
			customer: {
				columns: {
					id: true,
					fullName: true,
					email: true
				}
			},

			driver: {
				columns: {
					id: true,
					fullName: true,
					email: true
				}
			},
			products: {
				columns: {
					id: true,
					name: true,
					price: true,
					symbol: true
				}
			}
		},
		orderBy: (orders, { desc }) => [desc(orders.createdAt)]
	});

	const formattedData = data.reduce<{ count: number; orders: Order[] }>(
		(acc, order) => {
			const fixedOrder: Optional<typeof order, 'count'> = {
				...order
			};

			delete fixedOrder.count;

			return {
				count: order.count,
				orders: [...acc.orders, fixedOrder]
			};
		},
		{ count: 0, orders: [] }
	);

	console.log('formattedData', formattedData);

	return json(formattedData);
}
