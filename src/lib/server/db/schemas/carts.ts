import { relations, type InferSelectModel, type InferInsertModel, sql } from 'drizzle-orm';
import { sqliteTable, integer, index, text } from 'drizzle-orm/sqlite-core';
import { usersTable } from './users';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { cartProductsTable } from './cartProducts';

export const cartsTable = sqliteTable(
	'carts',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),

		// relations
		customerId: text('customer_id')
			.notNull()
			.references(() => usersTable.id), // who receives the product
		ownerId: text('owner_id')
			.notNull()
			.references(() => usersTable.id) // cart owner - adviser or customer
		// promoCode
	},
	(order) => ({
		// indexes
		customerId: index('cart_customer_idx').on(order.customerId),
		cartOwnerId: index('cart_owner_idx').on(order.ownerId)
	})
);

export const cartsRelations = relations(cartsTable, ({ one, many }) => ({
	customer: one(usersTable, {
		fields: [cartsTable.customerId],
		references: [usersTable.id]
	}),
	owner: one(usersTable, {
		fields: [cartsTable.ownerId],
		references: [usersTable.id]
	}),
	products: many(cartProductsTable)
}));

export const createCartSchema = createInsertSchema(cartsTable);
export const selectCartSchema = createSelectSchema(cartsTable);

export type SelectCart = InferSelectModel<typeof cartsTable>;
export type InsertCart = InferInsertModel<typeof cartsTable>;
