import { db } from '$lib/server/db';
import { orderProductsTable } from '$lib/server/db/schemas/orderProducts.js';
import { ordersTable } from '$lib/server/db/schemas/orders.js';
import { trytm } from '@bdsqqq/try';
import { error, json } from '@sveltejs/kit';

export async function POST(event) {
	// const sessionUser = event.locals.user;
	// if (sessionUser?.role !== 'admin') {
	// 	error(403, 'Nie masz uprawnień do wykonania tej akcji');
	// }

	// const [, deleteAllOrdersError] = await trytm(db.delete(ordersTable));

	// if (deleteAllOrdersError) {
	// 	console.error('deleteAllOrdersError blad', deleteAllOrdersError);
	// 	error(500, 'Niespodziewany błąd podczas usuwania wszystkich zamowien');
	// }

	// const [, deleteAllOrderProducts] = await trytm(db.delete(orderProductsTable));

	// if (deleteAllOrderProducts) {
	// 	console.error('deleteAllOrderProducts blad', deleteAllOrderProducts);
	// 	error(500, 'Niespodziewany błąd podczas usuwania produktów z zamówień');
	// }

	return json({ success: true, message: 'Usunieto wszystkie zamowienia' });
}
