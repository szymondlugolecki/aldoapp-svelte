import { db } from '$lib/server/db';
import { subscriptions } from '$lib/server/db/schemas/subscriptions.js';
import { trytm } from '@bdsqqq/try';
import { error, json } from '@sveltejs/kit';

export async function POST(event) {
	if (event.locals.session?.user.role !== 'admin') {
		throw error(403, 'Nie masz uprawnień do wykonania tej akcji');
	}

	const [, deleteAllProductsError] = await trytm(db.delete(subscriptions));

	if (deleteAllProductsError) {
		console.error('deleteAllProductsError blad', deleteAllProductsError);
		throw error(500, 'Niespodziewany błąd podczas usuwania wszystkich zamowien');
	}

	return json({ success: true, message: 'Usunieto wszystkie subskrypcje' });
}
