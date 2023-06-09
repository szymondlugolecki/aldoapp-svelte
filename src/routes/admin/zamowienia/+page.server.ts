// import add from '$lib/server/actions/users/add';
// import edit from '$lib/server/actions/users/edit';
// import { p } from '$lib/server/clients/pClient';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schemas/products';
import { users } from '$lib/server/db/schemas/users';
import { desc, eq } from 'drizzle-orm';
// import { alias } from 'drizzle-orm/mysql-core/alias';

export const load = () => {
	// const drivers = alias(users, 'drivers');

	const orders = db.query.orders.findMany({
		with: {
			promoCodes: true,
			users: true,
			products: true
		}
	});

	orders.then((res) => {
		res.forEach((order) => {
			console.log(order.products);
		});
	});

	return {
		orders
	};

	// return {
	// 	// fetch with products in the future
	// 	// when i find out how to do it
	// 	orders: db
	// 		.select({
	// 			order: orders,
	// 			attachedCustomer: {
	// 				id: users.id,
	// 				fullName: users.fullName,
	// 				email: users.email
	// 			},
	// 			attachedDriver: {
	// 				id: drivers.id,
	// 				fullName: drivers.fullName,
	// 				email: drivers.email
	// 			}
	// 			// productsList: {
	// 			// 	id: products.id,
	// 			// 	symbol: products.symbol,
	// 			// 	name: products.name,
	// 			// 	encodedURL: products.encodedURL
	// 			// }
	// 		})
	// 		.from(orders)
	// 		.orderBy(desc(orders.createdAt))
	// 		.limit(3)
	// 		.leftJoin(users, eq(orders.customerId, users.id))
	// 		.leftJoin(drivers, eq(drivers.id, orders.driverId)),
	// 	promise: {
	// 		// order it by updatedAt once drizzle/planetscale supports it
	// 		orders: db
	// 			.select({
	// 				order: orders,
	// 				attachedCustomer: {
	// 					id: users.id,
	// 					fullName: users.fullName,
	// 					email: users.email
	// 				},
	// 				attachedDriver: {
	// 					id: drivers.id,
	// 					fullName: drivers.fullName,
	// 					email: drivers.email
	// 				}
	// 			})
	// 			.from(orders)
	// 			.orderBy(desc(orders.createdAt))
	// 			.limit(999_999)
	// 			.offset(3)
	// 			.leftJoin(users, eq(orders.customerId, users.id))
	// 			.leftJoin(drivers, eq(drivers.id, orders.driverId))
	// 	}
	// };
};

// export const actions = {
// 	add,
// 	edit
// };
