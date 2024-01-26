import { db } from '$lib/server/db';
import { verificationTokens } from '$lib/server/db/schemas/verificationTokens.js';
import { trytm } from '@bdsqqq/try';
import { error, json } from '@sveltejs/kit';

export async function POST(event) {
	if (event.locals.session?.user.role !== 'admin') {
		error(403, 'Nie masz uprawnień do wykonania tej akcji');
	}

	const [, deleteAllTokensError] = await trytm(db.delete(verificationTokens));

	if (deleteAllTokensError) {
		console.error('deleteAllTokensError blad', deleteAllTokensError);
		error(500, 'Niespodziewany błąd podczas usuwania wszystkich tokenów');
	}

	return json({ success: true, message: 'Usunieto wszystkie tokeny' });
}
