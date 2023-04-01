// import { p } from '$lib/server/clients/pClient';

import add from '$lib/server/actions/product/add';
import edit from '$lib/server/actions/product/edit';
import remove from '$lib/server/actions/product/remove';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schemas/products';
import { users } from '$lib/server/db/schemas/users';
import { eq } from 'drizzle-orm/expressions';

export const load = async () => {
	return {
		products: db
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
			.leftJoin(users, eq(products.userId, users.id))
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
};

export const actions = {
	add,
	edit,
	remove
};
