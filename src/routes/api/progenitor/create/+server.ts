import { db } from '$lib/server/db';
import { createUser } from '$lib/server/functions/db';
import { trytm } from '@bdsqqq/try';
import { error, json } from '@sveltejs/kit';
import { generateId } from 'lucia';

export async function POST() {
	const [user, fetchUserError] = await trytm(db.query.usersTable.findFirst());
	if (fetchUserError) {
		error(500, 'Niespodziewany błąd podczas próby pobrania użytkownika');
	}

	if (user) {
		error(400, 'Nie można utworzyć użytkownika protoplasty, ponieważ już istnieje');
	}

	const [, createProgenitorError] = await trytm(
		createUser({
			id: generateId(15),
			email: 'szymon.dlugolecki77@gmail.com',
			fullName: 'Szymon Długołęcki',
			role: 'admin',
			phone: '692694963',
			createdAt: new Date()
		})
	);

	if (createProgenitorError) {
		console.error('Protoplasta blad', createProgenitorError);
		error(500, 'Niespodziewany błąd podczas tworzenia użytkownika protoplasty');
	}

	return json({ success: true, message: 'Utworzono użytkownika protoplastę' });
}
