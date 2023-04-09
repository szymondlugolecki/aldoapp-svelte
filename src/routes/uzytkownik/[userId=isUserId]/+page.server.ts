import { db } from '$lib/server/db/index.js';
import { orders } from '$lib/server/db/schemas/products.js';
import { users } from '$lib/server/db/schemas/users.js';
import { getRoleRank } from '$lib/server/functions/auth';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm/expressions.js';

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

	const userData = await db
		.select({
			user: users,
			orders
		})
		.from(users)
		.leftJoin(orders, eq(users.id, orders.customerId))
		.where(eq(users.id, userId));

	// console.log('userData', userData);

	if (!userData) {
		throw error(404, 'Nie znaleziono użytkownika');
	}

	if (!userData[0] || !userData[0].user) {
		throw error(404, 'Nie znaleziono użytkownika');
	}

	if (sessionUser.id !== userData[0].user.id && roleRank < 1) {
		throw error(401, 'Nie masz uprawnień do przeglądania tego profilu');
	}

	return {
		userData
	};
};
