import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schemas/products.js';
import { trytm } from '@bdsqqq/try';
import { error, json } from '@sveltejs/kit';

export async function POST(event) {
	if (event.locals.session?.user.role !== 'admin') {
		throw error(403, 'Nie masz uprawnień do wykonania tej akcji');
	}

	const [, deleteAllProductsError] = await trytm(db.delete(products));

	if (deleteAllProductsError) {
		console.error('deleteAllProductsError', deleteAllProductsError);
		throw error(500, 'Niespodziewany błąd podczas usuwania wszystkich produktów');
	}

	return json({ success: true, message: 'Usunieto wszystkie produkty' });
}
