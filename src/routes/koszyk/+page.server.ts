import { getCustomRedirect } from '$lib/client/constants/customErrors';
import { isAtLeastModerator } from '$lib/client/functions/index.js';
import { cart$, order$ } from '$lib/client/schemas';
import changeProductQuantity from '$lib/server/actions/cart/changeProductQuantity';
import setCustomer from '$lib/server/actions/cart/setCustomer';

import createOrder from '$lib/server/actions/cart/order.js';
import { db } from '$lib/server/db';
import { trytm } from '@bdsqqq/try';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const actions = {
	changeProductQuantity,
	createOrder,
	setCustomer
};

export const load = async ({ locals }) => {
	const sessionUser = locals.session?.user;
	if (!sessionUser) {
		throw redirect(...getCustomRedirect('login-required', '/koszyk'));
	}

	const [cart] = await trytm(
		db.query.carts.findFirst({
			columns: {},
			where: (carts, { eq }) => eq(carts.ownerId, sessionUser.id),
			with: {
				customer: {
					columns: {},
					with: {
						address: {
							columns: {
								zipCode: true,
								city: true,
								street: true
							}
						}
					}
				}
			}
		})
	);

	const defaultAddress = cart?.customer.address;

	const [customers, customersFetchError] = isAtLeastModerator(sessionUser.role)
		? await trytm(
				db.query.users.findMany({
					where: (users, { eq, and }) =>
						and(eq(users.role, 'customer'), eq(users.adviserId, sessionUser.id)),
					columns: {
						id: true,
						fullName: true,
						email: true,
						phone: true
					},
					with: {
						address: {
							columns: {
								zipCode: true,
								city: true,
								street: true
							}
						}
					}
				})
		  )
		: [null, null];

	if (customersFetchError) {
		// Unexpected-error
		console.error(customersFetchError);
	}

	// Populate the form with default values
	return {
		customers,
		orderForm: superValidate(order$.create),
		productQuantityForm: superValidate(order$.productQuantity),
		setCustomerForm: superValidate(cart$.changeCartCustomer)
	};
};
