import getCustomError from '$lib/client/constants/customErrors';
import { db } from '$lib/server/db/index.js';
import { trytm } from '@bdsqqq/try';
import { error, json } from '@sveltejs/kit';

export async function GET({ locals }) {
	const sessionUser = locals.session?.user;

	if (!sessionUser) {
		error(...getCustomError('not-logged-in'));
	}

	// Fetch all users with role 'customer' and adviserId equal to sessionUser.id
	const [advisers, fetchAdvisersError] = await trytm(
		db.query.users.findMany({
			where: (users, { eq, and }) =>
				and(eq(users.role, 'customer'), eq(users.adviserId, sessionUser.id)),
			columns: {
				id: true,
				fullName: true,
				email: true,
				phone: true
			}
		})
	);

	if (fetchAdvisersError) {
		error(500, 'Nie udało się pobrać listy doradców');
	}

	// const response = await fetch(url);

	// setHeaders({
	//     age: response.headers.get('age'),
	//     'cache-control': response.headers.get('cache-control')
	// });

	return json({ success: true, advisers });
}
