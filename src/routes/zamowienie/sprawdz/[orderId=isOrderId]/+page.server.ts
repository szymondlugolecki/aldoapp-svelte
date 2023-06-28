import { getRoleRank } from '$lib/client/functions';
import { db } from '$lib/server/db/index.js';
import { orders, products } from '$lib/server/db/schemas/products.js';
import { error } from '@sveltejs/kit';
import { eq, inArray } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
	const sessionUser = locals.session?.user;
	// In order to see order details, user must be:
	// 1. logged in
	// 2a. must be the owner of the order
	// 2b. must be an admin/mod

	if (!sessionUser) {
		throw error(401, 'Nie jesteś zalogowany');
	}

	const roleRank = getRoleRank(sessionUser.role);

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
			price: orders.price,
			discount: orders.discount,
			estimatedDeliveryDate: orders.estimatedDeliveryDate
		})
		.from(orders)
		// .leftJoin(
		// 	sql`JSON_TABLE(orders.products, '$[*]' COLUMNS (productId INT PATH '$.productId', quantity INT PATH '$.quantity')) AS op`,
		// 	sql`1=1`
		// )
		// // .leftJoin(sql`products`, sql`op.productId = products.id`)
		.where(eq(orders.id, Number(params.orderId)));

	console.log('queriedOrder', queriedOrder);

	if (!queriedOrder) {
		throw error(404, 'Nie znaleziono zamówienia');
	}

	if (sessionUser.id !== queriedOrder.customerId && roleRank < 1) {
		throw error(401, 'Nie masz uprawnień do przeglądania tego zamówienia');
	}

	const queriedProducts = await db
		.select({
			id: products.id,
			name: products.name,
			price: products.price,
			symbol: products.symbol,
			images: products.images
		})
		.from(products)
		.where(
			inArray(
				products.id,
				queriedOrder.products.map((p) => p.productId)
			)
		);

	if (!queriedProducts) {
		throw error(404, 'Nie udało się wczytać zamówionych produktów');
	}

	if (queriedProducts.length !== queriedOrder.products.length) {
		throw error(404, 'Nie udało się wczytać wszystkich zamówionych produktów');
	}

	return {
		order: queriedOrder,
		products: queriedProducts
	};
};
