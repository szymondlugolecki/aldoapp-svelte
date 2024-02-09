import { relations, type InferSelectModel, type InferInsertModel, sql } from 'drizzle-orm';
import { sqliteTable, integer, index } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { cartProducts } from './cartProducts';

export const carts = sqliteTable(
	'carts',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),

		// relations
		customerId: integer('customer_id', { mode: 'number' })
			.notNull()
			.references(() => users.id), // who receives the product
		ownerId: integer('owner_id', { mode: 'number' })
			.notNull()
			.references(() => users.id) // cart owner - adviser or customer
		// promoCode
	},
	(order) => ({
		// indexes
		customerId: index('cart_customer_idx').on(order.customerId),
		cartOwnerId: index('cart_owner_idx').on(order.ownerId)
	})
);

export const cartsRelations = relations(carts, ({ one, many }) => ({
	customer: one(users, {
		fields: [carts.customerId],
		references: [users.id]
	}),
	owner: one(users, {
		fields: [carts.ownerId],
		references: [users.id]
	}),
	products: many(cartProducts)
}));

export const createCartSchema = createInsertSchema(carts);
export const selectCartSchema = createSelectSchema(carts);

export type SelectCart = InferSelectModel<typeof carts>;
export type InsertCart = InferInsertModel<typeof carts>;
