import { db } from '$lib/server/db';
import { subscriptions } from '$lib/server/db/schemas/subscriptions.js';
import { trytm } from '@bdsqqq/try';
import { error, json } from '@sveltejs/kit';

export async function POST(event) {
	if (event.locals.user.role !== 'admin') {
		error(403, 'Nie masz uprawnień do wykonania tej akcji');
	}

	const [, deleteAllSubscriptionsError] = await trytm(db.delete(subscriptions));

	if (deleteAllSubscriptionsError) {
		console.error('deleteAllSubscriptionsError blad', deleteAllSubscriptionsError);
		error(500, 'Niespodziewany błąd podczas usuwania wszystkich subskrypcji');
	}

	return json({ success: true, message: 'Usunieto wszystkie subskrypcje' });
}
