import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const userAddress = sqliteTable('user_address', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),

	// Address
	zipCode: text('zip_code', { length: 10 }).notNull(),
	street: text('street', { length: 255 }).notNull(),
	city: text('city', { length: 255 }).notNull(),

	// relations
	userId: integer('user_id', { mode: 'number' })
		.notNull()
		.references(() => users.id)
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

export type SelectUserAddress = InferSelectModel<typeof userAddress>;
export type InsertUserAddress = InferInsertModel<typeof userAddress>;
