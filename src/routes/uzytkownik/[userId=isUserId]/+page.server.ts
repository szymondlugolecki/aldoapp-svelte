import { getRoleRank } from '$lib/client/functions';
import { db } from '$lib/server/db/index.js';
import { orders } from '$lib/server/db/schemas/products.js';
import { users } from '$lib/server/db/schemas/users.js';
import { trytm } from '@bdsqqq/try';
import { error } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm/expressions.js';

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

	const fetchOrders = db
		.select()
		.from(orders)
		.orderBy(desc(orders.id))
		.where(eq(orders.customerId, userId));
	const fetchUser = db.select().from(users).where(eq(users.id, userId));

	const [dbData, dbFetchError] = await trytm(Promise.all([fetchUser, fetchOrders]));

	if (dbFetchError) {
		throw error(500, 'Wystąpił błąd podczas pobierania danych');
	}

	const [usersData, ordersData] = dbData;

	// const userData = await db
	// 	.select({
	// 		user: users,
	// 		orders
	// 	})
	// 	.from(users)
	// 	.leftJoin(orders, eq(users.id, orders.customerId))
	// 	.where(eq(users.id, userId));

	// console.log('userData', userData);

	const userData = usersData[0];

	if (!userData) {
		throw error(404, 'Nie znaleziono użytkownika');
	}

	if (sessionUser.id !== userData.id && roleRank < 1) {
		throw error(401, 'Nie masz uprawnień do przeglądania tego profilu');
	}

	return {
		orders: ordersData,
		userData
	};
};
