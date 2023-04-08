import { db } from '$lib/server/db/index.js';
import { orders } from '$lib/server/db/schemas/products.js';
import { getRoleRank } from '$lib/server/functions/auth';
import { eq } from 'drizzle-orm/expressions.js';

export const load = async ({ params, locals }) => {
	const sessionUser = locals.session?.user;
	// only logged in user can see their orders
	// 1. must be logged in
	// 2. it must be their order

	if (!sessionUser) {
		return {
			order: null,
			message: 'Nie jesteś zalogowany.'
		};
	}


	const [queriedOrder] = await db
	.select({
		id: orders.id,
		createdAt: orders.createdAt,
		paymentStatus: orders.paymentStatus,
		deliveryStatus: orders.deliveryStatus,
		status: orders.status,
		deliveryMethod: orders.deliveryMethod,
		paymentMethod: orders.paymentMethod,
		customerId: orders.customerId,
		address: orders.address,
		products: orders.products,
		price: orders.price,
	})
	.from(orders)
	.where(eq(orders.id, Number(params.orderId)))

	const roleRank = getRoleRank(sessionUser.role)

	if (sessionUser.id !== queriedOrder.customerId && roleRank < 1) {
		return {
			order: null,
			message: 'Nie masz uprawnień do przeglądania tego zamówienia.'
		};
	}

	return {
		order: queriedOrder
	};
};
