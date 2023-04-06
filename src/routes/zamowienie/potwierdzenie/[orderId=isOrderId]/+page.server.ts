import { db } from '$lib/server/db/index.js';
import { orders } from '$lib/server/db/schemas/products.js';
import { eq } from 'drizzle-orm/expressions.js';

export const load = ({ params, locals }) => {
	const sessionUser = locals.session?.user;
	if (!sessionUser) {
		return {
			orders: null
		};
	}

	return {
		orders: db
			.select({
				id: orders.id,
				createdAt: orders.createdAt,
				paymentStatus: orders.paymentStatus,
				deliveryStatus: orders.deliveryStatus,
				status: orders.status,
				deliveryMethod: orders.deliveryMethod,
				paymentMethod: orders.paymentMethod,
				customerId: orders.customerId
			})
			.from(orders)
			.where(eq(orders.id, Number(params.orderId)))
	};
};
