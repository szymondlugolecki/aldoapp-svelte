import { db } from '$lib/server/db';
import { users, type User } from '$lib/server/db/schemas/users';
import { createId } from '@paralleldrive/cuid2';
import { error, json } from '@sveltejs/kit';

export async function POST() {
	const progenitorUser = {
		id: createId(),
		email: 'szymon.dlugolecki77@gmail.com',
		fullName: 'Szymon Długołęcki',
		role: 'admin',
		access: true
	} satisfies Omit<User, 'createdAt'>;

	try {
		await db.insert(users).values(progenitorUser);
	} catch (err) {
		console.error('Protoplasta blad', err);
		throw error(500, 'Niespodziewany błąd podczas tworzenia użytkownika protoplasty');
	}

	return json({ success: true, message: 'Utworzono użytkownika protoplastę' });
}
