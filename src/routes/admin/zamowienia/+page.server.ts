// import add from '$lib/server/actions/users/add';
// import edit from '$lib/server/actions/users/edit';
// import { p } from '$lib/server/clients/pClient';
import { db } from '$lib/server/db';
import { orders, products } from '$lib/server/db/schemas/products';
import { users } from '$lib/server/db/schemas/users';
import { desc, eq, inArray } from 'drizzle-orm/expressions';

export const load = () => {
	return {
		orders: db
			.select({
				order: orders,
				attachedCustomer: {
					id: users.id,
					fullName: users.fullName,
					email: users.email
				},
				productsList: {
					id: products.id,
					symbol: products.symbol,
					name: products.name,
					encodedURL: products.encodedURL
				}
			})
			.from(orders)
			.orderBy(desc(orders.createdAt))
			.limit(3)
			.leftJoin(users, eq(orders.customerId, users.id))
			.leftJoin(products, inArray(products.id /*orders.products.map(({ id }) => id)*/)),
		promise: {
			// order it by updatedAt once drizzle/planetscale supports it
			orders: db
				.select({
					order: orders,
					attachedCustomer: {
						id: users.id,
						fullName: users.fullName,
						email: users.email
					}
				})
				.from(orders)
				.orderBy(desc(orders.createdAt))
				.limit(999_999)
				.offset(3)
				.leftJoin(users, eq(orders.customerId, users.id))
		}
	};
};

// export const actions = {
// 	add,
// 	edit
// };
