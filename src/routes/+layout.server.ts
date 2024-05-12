// import { db } from '$lib/server/db';
// import { users } from '$lib/server/db/schemas/users';
// import { trytm } from '@bdsqqq/try';
// import { eq } from 'drizzle-orm';
// import { orders } from '$lib/server/db/schemas/products.js';

// import { isAtLeastModerator } from '$lib/client/functions/index.js';
import { db } from '$lib/server/db';
import { trytm } from '@bdsqqq/try';
// import type { Config } from '@sveltejs/adapter-vercel';

// export const config: Config = {
// 	runtime: 'edge'
// };

export const load = async ({ locals, url }) => {
	// depends('session');
	const sessionUser = locals.user;

	const base = {
		me: locals.user,
		url: url.href
	};

	if (!sessionUser) {
		return base;
	}

	const [fetchedCart] = await trytm(
		db.query.cartsTable.findFirst({
			where: (carts, { eq }) => eq(carts.ownerId, sessionUser.id),
			with: {
				customer: {
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
				},
				products: {
					columns: {
						id: true,
						quantity: true
					},
					with: {
						product: {
							columns: {
								id: true,
								name: true,
								price: true,
								symbol: true,
								encodedURL: true,
								image: true
							}
						}
					}
				}
			}
		})
	);

	if (!fetchedCart) {
		return base;
	}

	const groupedProducts = fetchedCart.products.map(({ product, quantity }) => ({
		...product,
		quantity
	}));

	const fixedCart = {
		...fetchedCart,
		products: groupedProducts
	};

	return {
		...base,
		cart: fixedCart
		// lazy: {
		// 	...(isAtLeastModerator(sessionUser.role)
		// 		? {
		// 				customers: db.query.usersTable.findMany({
		// 					where: (users, { eq, and }) =>
		// 						and(eq(users.role, 'customer'), eq(users.adviserId, sessionUser.id)),
		// 					columns: {
		// 						id: true,
		// 						fullName: true,
		// 						email: true,
		// 						phone: true
		// 					},
		// 					with: {
		// 						address: {
		// 							columns: {
		// 								zipCode: true,
		// 								city: true,
		// 								street: true
		// 							}
		// 						}
		// 					}
		// 				})
		// 		  }
		// 		: { customers: [] })
		// }
	};
};
