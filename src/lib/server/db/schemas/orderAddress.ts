import type { InferModel } from 'drizzle-orm';
import {
	mysqlTable,
	varchar,
	serial,
	int,
} from 'drizzle-orm/mysql-core';

export const orderAddress = mysqlTable(
	'order_address',
	{
		id: serial('id').primaryKey().autoincrement(),

		// address
		zipCode: varchar('zip_code', { length: 10 }).notNull(),
        street: varchar('street', { length: 255 }).notNull(),
        city: varchar('city', { length: 255 }).notNull(),

		// relations
		orderId: int('order_id').notNull()
	}
);

// export const addressRelations = relations(address, ({ one }) => ({
// 	user: one(users, {
// 		fields: [address.userId],
// 		references: [users.id]
// 	}),
//     order: one(orders, {
// 		fields: [address.userId],
// 		references: [orders.id]
// 	})
// }));

export type OrderAddress = InferModel<typeof orderAddress>;
