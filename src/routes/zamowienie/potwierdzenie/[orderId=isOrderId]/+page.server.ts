import { getRoleRank } from '$lib/client/functions';
import { db } from '$lib/server/db/index.js';
import { orders } from '$lib/server/db/schemas/products.js';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm/expressions.js';

export const load = async ({ params, locals }) => {
	const sessionUser = locals.session?.user;
	// only logged in user can see their orders
	// 1. must be logged in
	// 2. it must be their order

	if (!sessionUser) {
		throw error(401, 'Nie jesteś zalogowany');
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
			products: orders.productsQuantity,
			price: orders.price
		})
		.from(orders)
		.where(eq(orders.id, Number(params.orderId)));

	if (!queriedOrder) {
		throw error(404, 'Nie znaleziono zamówienia');
	}

	const roleRank = getRoleRank(sessionUser.role);

	if (sessionUser.id !== queriedOrder.customerId && roleRank < 1) {
		throw error(401, 'Nie masz uprawnień do przeglądania tego zamówienia');
	}

	return {
		order: queriedOrder
	};
};
