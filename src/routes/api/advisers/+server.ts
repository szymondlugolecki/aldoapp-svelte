import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schemas/users';
import { trytm } from '@bdsqqq/try';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function GET({ setHeaders, url }) {
	const [advisers, fetchAdvisersError] = await trytm(
		db
			.select({ id: users.id, fullName: users.fullName, email: users.email })
			.from(users)
			.where(eq(users.role, 'adviser'))
	);

	if (fetchAdvisersError || !advisers) {
		throw error(500, 'Nie udało się pobrać listy doradców');
	}

	// const response = await fetch(url);

	// setHeaders({
	//     age: response.headers.get('age'),
	//     'cache-control': response.headers.get('cache-control')
	// });

	return json({ success: true, advisers });
}
