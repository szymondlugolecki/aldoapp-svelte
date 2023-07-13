import { isAtLeastModerator } from '$lib/client/functions';
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

	const isMod = isAtLeastModerator(sessionUser.role);

	const userId = params.userId === 'ja' ? sessionUser.id : params.userId;

	const [user, fetchUserError] = await trytm(
		db.query.users.findFirst({
			where: (user, { eq }) => eq(user.id, userId),
			with: {
				adviser: {
					columns: {
						id: true,
						fullName: true,
						email: true,
						phone: true
					}
				}
			}
		})
	);

	if (fetchUserError) {
		// Unexpected-error
		console.error('fetchUserError', fetchUserError);
		throw error(500, 'Wystąpił błąd podczas pobierania danych użytkownika');
	}

	if (!user) {
		throw error(404, 'Podany użytkownik nie istnieje');
	}

	if (sessionUser.id !== user.id && !isMod) {
		throw error(401, 'Nie masz uprawnień do przeglądania profilu tego użytkownika');
	}

	const [orders, fetchOrdersError] = await trytm(
		db.query.orders.findFirst({
			where: (orders, { eq }) => eq(orders.customerId, params.userId),
			columns: {
				id: true,
				price: true,
				createdAt: true,
				status: true,
				paymentStatus: true,
				deliveryStatus: true
			}
		})
	);

	if (fetchOrdersError) {
		// Unexpected-error
		console.error('fetchOrdersError', fetchOrdersError);
		throw error(500, 'Wystąpił błąd podczas pobierania zamówień użytkownika');
	}

	return {
		user,
		orders
	};
};
