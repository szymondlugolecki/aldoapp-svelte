import { db } from '$lib/server/db';
import { addUser } from '$lib/server/functions/db';
import { trytm } from '@bdsqqq/try';
import { createId } from '@paralleldrive/cuid2';
import { error, json } from '@sveltejs/kit';

export async function POST() {
	const [user, fetchUserError] = await trytm(db.query.users.findFirst());
	if (fetchUserError) {
		throw error(500, 'Niespodziewany błąd podczas próby pobrania użytkownika');
	}

	if (user) {
		throw error(400, 'Nie można utworzyć użytkownika protoplasty, ponieważ już istnieje');
	}

	const [, createProgenitorError] = await trytm(
		addUser({
			id: createId(),
			email: 'szymon.dlugolecki77@gmail.com',
			fullName: 'Szymon Długołęcki',
			role: 'admin',
			phone: '692694963',
			createdAt: new Date()
		})
	);

	if (createProgenitorError) {
		console.error('Protoplasta blad', createProgenitorError);
		throw error(500, 'Niespodziewany błąd podczas tworzenia użytkownika protoplasty');
	}

	return json({ success: true, message: 'Utworzono użytkownika protoplastę' });
}
