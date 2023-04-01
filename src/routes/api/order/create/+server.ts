import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { orderValidation } from '$lib/client/schemas/order';
// import { p } from '$lib/server/clients/pClient';
import { db } from '$lib/server/db';
import { orders, type Order } from '$lib/server/db/schemas/products';
import { sleep } from '$lib/server/functions/utils';
import type { Optional } from '$types/UtilityTypes';
import { trytm } from '@bdsqqq/try';
import { json, error } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	// Only logged in users can order
	if (!locals.session?.user) {
		throw error(401, 'Nie jesteś zalogowany');
	}

	// Make sure the request body is valid JSON
	const [data, dataParseError] = await trytm(request.json());
	if (dataParseError) {
		throw error(400, 'Nieprawidłowe dane');
	}

	// Validate the request body
	const [orderData, parseError] = betterZodParse(orderValidation, data);
	if (parseError) {
		throw error(400, parseError[0]);
	}

	// Modify the order data to match the database schema
	const order: Optional<typeof orderData, 'promoCode'> = {
		...orderData
	};
	delete order.promoCode;
	const newOrder: Omit<Order, 'id' | 'createdAt'> = {
		...order,
		customerId: locals.session.user.id,
		deliveryStatus: 'pending',
		paymentStatus: 'pending',
		status: 'pending',
		promoCodeId: null
	};

	// Insert the order into the database
	const [, insertOrderError] = await trytm(db.insert(orders).values(newOrder));
	if (insertOrderError) {
		// Unexpected-error
		throw error(
			500,
			'Niespodziewany błąd. Zamówienie jest poprawne, ale nie udało się go utworzyć'
		);
	}

	await sleep(3);

	return json({
		success: true
	});
}

// p.order.create({
// 	data: {
// 		...orderData,
// 		customerId: locals.session.user.id,
// 		status: 'pending'
// 	}
// });

// throw redirect(307, '/zamowienie/dziekujemy/_id_zamowienia_');
