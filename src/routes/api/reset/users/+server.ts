import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schemas/users.js';
import { trytm } from '@bdsqqq/try';
import { error, json } from '@sveltejs/kit';
import { ne } from 'drizzle-orm';

export async function POST(event) {
	if (event.locals.session?.user.role !== 'admin') {
		throw error(403, 'Nie masz uprawnień do wykonania tej akcji');
	}

	const [, deleteAllUsersError] = await trytm(
		db.delete(users).where(ne(users.email, 'szymon.dlugolecki77@gmail.com'))
	);

	if (deleteAllUsersError) {
		console.error('deleteAllUsersError', deleteAllUsersError);
		throw error(500, 'Niespodziewany błąd podczas usuwania wszystkich użytkowników');
	}

	return json({ success: true, message: 'Usunieto wszystkich użytkowników' });
}
