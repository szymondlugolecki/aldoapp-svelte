import { getRoleRank } from '$lib/client/functions';
import { db } from '$lib/server/db/index.js';
import { trytm } from '@bdsqqq/try';
import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	const sessionUser = locals.session?.user;
	// In order to see order details, user must be:
	// 1. logged in
	// 2a. must be the owner of the order
	// 2b. must be an admin/mod

	if (!sessionUser) {
		throw error(401, 'Nie jesteś zalogowany');
	}

	const roleRank = getRoleRank(sessionUser.role);

	let userId = params.userId;

	if (params.userId === 'ja') {
		userId = sessionUser.id;
	}

	const [user, fetchUserError] = await trytm(
		db.query.users.findFirst({ where: (user, { eq }) => eq(user.id, userId) })
	);

	if (fetchUserError) {
		throw error(500, 'Wystąpił błąd podczas pobierania danych użytkownika');
	}

	if (!user) {
		throw error(404, 'Podany użytkownik nie istnieje');
	}

	if (sessionUser.id !== user.id && roleRank < 1) {
		throw error(401, 'Nie masz uprawnień do przeglądania tego profilu');
	}

	return {
		user
	};
};
