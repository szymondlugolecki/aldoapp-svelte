import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { usersTable } from './users';

export const userAddressTable = sqliteTable('user_address', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),

	// Address
	zipCode: text('zip_code', { length: 10 }).notNull(),
	street: text('street', { length: 255 }).notNull(),
	city: text('city', { length: 255 }).notNull(),

	// relations
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id)
});

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

export type SelectUserAddress = InferSelectModel<typeof userAddressTable>;
export type InsertUserAddress = InferInsertModel<typeof userAddressTable>;
