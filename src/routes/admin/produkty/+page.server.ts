// import { p } from '$lib/server/clients/pClient';

import add from '$lib/server/actions/product/add';
import edit from '$lib/server/actions/product/edit';
import remove from '$lib/server/actions/product/remove';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schemas/products';
import { users, type User } from '$lib/server/db/schemas/users';
import { eq } from 'drizzle-orm';
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
	runtime: 'nodejs18.x'
};

export const load = async () => {
	const productsArr = await db
		.select({
			products: products,
			author: {
				id: users.id,
				fullName: users.fullName,
				email: users.email,
				role: users.role
			}
		})
		.from(products)
		.leftJoin(users, eq(products.authorId, users.id))
		.limit(10);

	return {
		products: productsArr.map((product) => ({
			...product.products,
			author: product.author as Pick<User, 'id' | 'fullName' | 'email' | 'role'>
		}))
	};
};

export const actions = {
	add,
	edit,
	remove
};

// p.product.findMany({
// 	include: {
// 		author: {
// 			select: {
// 				id: true,
// 				fullName: true,
// 				email: true,
// 				role: true
// 			}
// 		},
// 		images: {
// 			select: {
// 				url: true
// 			}
// 		}
// 	}
// })
