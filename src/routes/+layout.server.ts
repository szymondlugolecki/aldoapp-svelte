// import { db } from '$lib/server/db';
// import { orders } from '$lib/server/db/schemas/products.js';

export const load = async ({ locals, depends, url }) => {
	depends('session');

	// console.log('load function', 'session user', locals.session?.user);

	// const v = await db.delete(orders);
	// console.log('deleted', v);

	return {
		user: locals.session?.user,
		url: url.href
	};
};
