import { db } from '$lib/server/db';
import { orderProductsTable } from '$lib/server/db/schemas/orderProducts';
import { ordersTable } from '$lib/server/db/schemas/orders';
import { productsTable } from '$lib/server/db/schemas/products.js';
import { usersTable } from '$lib/server/db/schemas/users.js';
import { trytm } from '@bdsqqq/try';
import { error, json } from '@sveltejs/kit';
import { eq, ne, or } from 'drizzle-orm';

export async function POST(event) {
	// const sessionUser = event.locals.user;
	// if (sessionUser?.role !== 'admin') {
	// 	error(403, 'Nie masz uprawnień do wykonania tej akcji');
	// }

	// // const [, deleteAllUsersError] = await trytm(
	// // 	db.delete(usersTable).where(ne(usersTable.email, 'szymon.dlugolecki77@gmail.com'))
	// // );

	// // if (deleteAllUsersError) {
	// // 	console.error('deleteAllUsersError', deleteAllUsersError);
	// // 	error(500, 'Niespodziewany błąd podczas usuwania wszystkich użytkowników');
	// // }

	// console.log('what\n\n\n\n');

	// const [, deleteAllUsersError] = await trytm(
	// 	// db
	// 	// 	.delete(usersTable)
	// 	// 	.where(
	// 	// 		or(
	// 	// 			eq(usersTable.email, 'adam.malysz@gmail.com'),
	// 	// 			eq(usersTable.email, 'henryk.sienkiewicz@gmail.com'),
	// 	// 			eq(usersTable.email, 'robert.kowalczyk@gmail.com')
	// 	// 		)
	// 	// 	)
	// 	db.batch([
	// 		db.delete(productsTable),
	// 		db.delete(orderProductsTable),
	// 		db.delete(ordersTable),
	// 		db
	// 			.delete(usersTable)
	// 			.where(
	// 				or(
	// 					eq(usersTable.email, 'adam.malysz@gmail.com'),
	// 					eq(usersTable.email, 'henryk.sienkiewicz@gmail.com'),
	// 					eq(usersTable.email, 'robert.kowalczyk@gmail.com')
	// 				)
	// 			)
	// 	])
	// );

	// if (deleteAllUsersError) {
	// 	console.error('deleteAllUsersError', deleteAllUsersError);
	// 	error(500, 'Niespodziewany błąd podczas usuwania wszystkich użytkowników');
	// }

	return json({ success: true, message: 'Usunieto użytkowników' });
}
