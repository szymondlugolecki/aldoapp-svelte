import { db } from '$lib/server/db';
import { orderProducts } from '$lib/server/db/schemas/orderProducts.js';
import { orders } from '$lib/server/db/schemas/orders.js';
import { trytm } from '@bdsqqq/try';
import { error, json } from '@sveltejs/kit';

export async function POST(event) {
	if (event.locals.user.role !== 'admin') {
		error(403, 'Nie masz uprawnień do wykonania tej akcji');
	}

	const [, deleteAllOrdersError] = await trytm(db.delete(orders));

	if (deleteAllOrdersError) {
		console.error('deleteAllOrdersError blad', deleteAllOrdersError);
		error(500, 'Niespodziewany błąd podczas usuwania wszystkich zamowien');
	}

	const [, deleteAllOrderProducts] = await trytm(db.delete(orderProducts));

	if (deleteAllOrderProducts) {
		console.error('deleteAllOrderProducts blad', deleteAllOrderProducts);
		error(500, 'Niespodziewany błąd podczas usuwania produktów z zamówień');
	}

	return json({ success: true, message: 'Usunieto wszystkie zamowienia' });
}
