import { db } from '$lib/server/db';
import { productsTable } from '$lib/server/db/schemas/products.js';
import { trytm } from '@bdsqqq/try';
import { error, json } from '@sveltejs/kit';

export async function POST(event) {
	// const sessionUser = event.locals.user;
	// if (sessionUser?.role !== 'admin') {
	// 	error(403, 'Nie masz uprawnień do wykonania tej akcji');
	// }

	// const [, deleteAllProductsError] = await trytm(db.delete(productsTable));

	// if (deleteAllProductsError) {
	// 	console.error('deleteAllProductsError', deleteAllProductsError);
	// 	error(500, 'Niespodziewany błąd podczas usuwania wszystkich produktów');
	// }

	return json({ success: true, message: 'Usunieto wszystkie produkty' });
}
