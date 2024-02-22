import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/db/schemas/users.js';
import { trytm } from '@bdsqqq/try';
import { error, json } from '@sveltejs/kit';
import { ne } from 'drizzle-orm';

export async function POST(event) {
	const sessionUser = event.locals.user;
	if (sessionUser?.role !== 'admin') {
		error(403, 'Nie masz uprawnień do wykonania tej akcji');
	}

	const [, deleteAllUsersError] = await trytm(
		db.delete(usersTable).where(ne(usersTable.email, 'szymon.dlugolecki77@gmail.com'))
	);

	if (deleteAllUsersError) {
		console.error('deleteAllUsersError', deleteAllUsersError);
		error(500, 'Niespodziewany błąd podczas usuwania wszystkich użytkowników');
	}

	return json({ success: true, message: 'Usunieto wszystkich użytkowników' });
}
