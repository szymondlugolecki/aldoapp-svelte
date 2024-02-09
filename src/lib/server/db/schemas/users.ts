import { userRoles } from '../../../client/constants/dbTypes';
import { relations, type InferSelectModel, type InferInsertModel, sql } from 'drizzle-orm';
// import {
// 	mysqlTable,
// 	uniqueIndex,
// 	varchar,
// 	char,
// 	timestamp,
// 	text,
// 	index
// } from 'drizzle-orm/mysql-core';

import { sqliteTable, integer, text, uniqueIndex, index } from 'drizzle-orm/sqlite-core';

import { verificationTokens } from './verificationTokens';
import { orders } from './orders';
import { products } from './products';
import { subscriptions } from './subscriptions';
import { promoCodes } from './promoCodes';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { carts } from './carts';
import { favoriteProducts } from './favoriteProducts';
import { userAddress } from './userAddress';
import { orderStatusLogs } from './orderStatusLogs';
// import { createId } from '@paralleldrive/cuid2';

export const users = sqliteTable(
	'users',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),

		// User data
		email: text('email', { length: 320 }).notNull(),
		fullName: text('name', { length: 256 }).notNull(),
		role: text('role', { enum: userRoles }).notNull(),
		phone: text('phone', { length: 15 }).notNull(),

		// relations
		adviserId: text('adviser_id', { length: 255 })
	},
	(user) => ({
		email: uniqueIndex('unique_emailx').on(user.email),
		adviserId: index('adviser_idx').on(user.adviserId)
	})
);

export const usersRelations = relations(users, ({ one, many }) => ({
	verificationTokens: many(verificationTokens),
	customer: many(orders, { relationName: 'order_customer' }),
	cartOwner: many(orders, { relationName: 'order_cart_owner' }),
	driver: many(orders, { relationName: 'order_driver' }),
	products: many(products, { relationName: 'products' }), // authored products
	subscriptions: many(subscriptions),
	promoCodes: many(promoCodes),
	carts: one(carts, {
		fields: [users.id],
		references: [carts.ownerId]
	}),
	adviser: one(users, {
		fields: [users.adviserId],
		references: [users.id],
		relationName: 'users'
	}),
	favoriteProducts: many(favoriteProducts, { relationName: 'favorite_products_user' }),
	statusLogs: many(orderStatusLogs),
	address: one(userAddress, {
		fields: [users.id],
		references: [userAddress.userId]
	})
}));

export const createUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export type SelectUser = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;
export type Role = SelectUser['role'];
export type GeneralRole = Extract<Role, 'customer' | 'admin'> | 'moderator';
