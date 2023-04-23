// import { db } from '$lib/server/db';
// import { users } from '$lib/server/db/schemas/users';
// import { eq } from 'drizzle-orm';
// import { orders } from '$lib/server/db/schemas/products.js';

export const load = async ({ locals, depends, url }) => {
	depends('session');

	// console.log('load function', 'session user', locals.session?.user);

	// const v = await db.delete(orders);
	// console.log('deleted', v);

	// await db.update(users).set({ role: 'admin' }).where(eq(users.id, 'x0vanu2mbse0uayd3rwtvbgv'));

	// console.log('userid', locals.session?.user?.id);

	return {
		user: locals.session?.user,
		url: url.href
	};
};
