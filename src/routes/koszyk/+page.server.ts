import { isAtLeastModerator } from '$lib/client/functions/index.js';
import { cart$, order$ } from '$lib/client/schemas';
import changeProductQuantity from '$lib/server/actions/cart/changeProductQuantity';
import setCustomer from '$lib/server/actions/cart/setCustomer';

import createOrder from '$lib/server/actions/cart/createOrder.js';
import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { and, eq } from 'drizzle-orm';
import { usersTable } from '$lib/server/db/schemas/users.js';
import { zod } from 'sveltekit-superforms/adapters';
import { trytm } from '@bdsqqq/try';

export const actions = {
	changeProductQuantity,
	createOrder,
	setCustomer
};

export const load = async ({ locals }) => {
	const sessionUser = locals.user;
	if (!sessionUser) {
		redirect(303, '/zaloguj');
	}

	// const [cart] = await trytm(
	// 	db.query.cartsTable.findFirst({
	// 		columns: {},
	// 		where: (carts, { eq }) => eq(carts.ownerId, sessionUser.id),
	// 		with: {
	// 			customer: {
	// 				columns: {},
	// 				with: {
	// 					address: {
	// 						columns: {
	// 							zipCode: true,
	// 							city: true,
	// 							street: true
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 	})
	// );

	// const defaultAddress = cart?.customer.address;

	const [cart] = await trytm(
		db.query.cartsTable.findFirst({
			columns: {},
			where: (carts, { eq }) => eq(carts.ownerId, sessionUser.id),
			with: {
				customer: {
					columns: {
						id: true
					}
				}
			}
		})
	);

	const forms = {
		orderForm: await superValidate(zod(order$.create)),
		productQuantityForm: await superValidate(zod(order$.productQuantity)),
		setCustomerForm: await superValidate(
			cart
				? {
						customerId: cart.customer.id
				  }
				: undefined,
			zod(cart$.changeCartCustomer)
		)
	};

	if (isAtLeastModerator(sessionUser.role)) {
		const whereCondition =
			sessionUser.role === 'admin'
				? eq(usersTable.role, 'customer')
				: and(eq(usersTable.role, 'customer'), eq(usersTable.adviserId, sessionUser.id));
		const customers = await db.query.usersTable.findMany({
			where: () => whereCondition,
			columns: {
				id: true,
				fullName: true,
				email: true
			}
		});

		return {
			customers,
			...forms
		};
	}

	return {
		customers: null,
		...forms
	};
};
