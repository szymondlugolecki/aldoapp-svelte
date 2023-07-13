// import { cartStatus } from '../../../client/constants/dbTypes';

import { relations, type InferModel } from 'drizzle-orm';
import {
	mysqlTable,
	serial,
	varchar,
	timestamp,
	int,
	index,
	text,
	json
} from 'drizzle-orm/mysql-core';
import { users } from './users';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { cartProducts } from './cartProducts';
import { deliveryMethods, paymentMethods } from '../../../client/constants/dbTypes';
import type { Address } from './orders';

export const carts = mysqlTable(
	'carts',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at').defaultNow(),

		// Cart data
		// status: text('delivery_method', { enum: cartStatus }).notNull(),
		deliveryMethod: text('delivery_method', { enum: deliveryMethods }).notNull(),
		paymentMethod: text('payment_method', { enum: paymentMethods }).notNull(),
		customAddress: json('address').$type<Address>(), // optional custom address

		// relations
		cartProductsIds: int('cart_products_ids'),
		customerId: varchar('customer_id', { length: 36 }).notNull(), // who receives the product
		ownerId: varchar('owner_id', { length: 36 }).notNull() // cart owner - adviser or customer
	},
	(order) => ({
		// indexes
		customerId: index('customer_idx').on(order.customerId)
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

export type Cart = InferModel<typeof carts>;
