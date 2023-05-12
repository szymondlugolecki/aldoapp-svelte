// import { db } from '$lib/server/db';
// import { users } from '$lib/server/db/schemas/users';
// import { trytm } from '@bdsqqq/try';
// import { eq } from 'drizzle-orm';
// import { orders } from '$lib/server/db/schemas/products.js';

export const load = async ({ locals, depends, url }) => {
	depends('session');

	// console.log('load function', 'session user', locals.session?.user);

	// const v = await db.delete(orders);
	// console.log('deleted', v);

	// const result = await db
	// 	.select({
	// 		id: users.id,
	// 		role: users.role
	// 	})
	// 	.from(users)
	// 	.where(eq(users.id, 'x0vanu2mbse0uayd3rwtvbgv'));

	// console.log('result', result);

	// const [result, err] = await trytm(
	// 	db.update(users).set({ role: 'admin' }).where(eq(users.id, 'x0vanu2mbse0uayd3rwtvbgv'))
	// );

	// if (err) {
	// 	console.log('error', err);
	// }

	// if (result) {
	// 	console.log('result', result);
	// }

	// console.log('userid', locals.session?.user?.id);

	return {
		user: locals.session?.user,
		url: url.href
	};
};
