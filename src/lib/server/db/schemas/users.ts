import { userRoles } from '../../../client/constants/dbTypes';
import { relations, type InferSelectModel, type InferInsertModel, sql } from 'drizzle-orm';
import {
	sqliteTable,
	integer,
	text,
	uniqueIndex,
	index,
	foreignKey
} from 'drizzle-orm/sqlite-core';

import { verificationTokensTable } from './verificationTokens';
import { ordersTable } from './orders';
import { productsTable } from './products';
import { subscriptionsTable } from './subscriptions';
import { promoCodesTable } from './promoCodes';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { cartsTable } from './carts';
import { favoriteProductsTable } from './favoriteProducts';
import { userAddressTable } from './userAddress';
import { orderStatusLogsTable } from './orderStatusLogs';

export const usersTable = sqliteTable(
	'usersTable',
	{
		id: text('id').notNull().primaryKey(), //integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),

		// User data
		email: text('email', { length: 320 }).notNull(),
		fullName: text('name', { length: 256 }).notNull(),
		role: text('role', { enum: userRoles }).notNull(),
		phone: text('phone', { length: 15 }).notNull(),

		// relations
		adviserId: text('adviser_id')
	},
	(user) => ({
		email: uniqueIndex('unique_emailx').on(user.email),
		adviserId: index('adviser_idx').on(user.adviserId),
		adviserReference: foreignKey({
			columns: [user.adviserId],
			foreignColumns: [user.id],
			name: 'users_adviser_id'
		}).onDelete('cascade')
	})
);

export const usersRelations = relations(usersTable, ({ one, many }) => ({
	verificationTokens: many(verificationTokensTable),
	customer: many(ordersTable, { relationName: 'order_customer' }),
	cartOwner: many(ordersTable, { relationName: 'order_cart_owner' }),
	driver: many(ordersTable, { relationName: 'order_driver' }),
	products: many(productsTable, { relationName: 'products' }), // authored products
	subscriptions: many(subscriptionsTable),
	promoCodes: many(promoCodesTable),
	carts: one(cartsTable, {
		fields: [usersTable.id],
		references: [cartsTable.ownerId]
	}),
	adviser: one(usersTable, {
		fields: [usersTable.adviserId],
		references: [usersTable.id],
		relationName: 'usersTable'
	}),
	favoriteProducts: many(favoriteProductsTable, { relationName: 'favorite_products_user' }),
	statusLogs: many(orderStatusLogsTable),
	address: one(userAddressTable, {
		fields: [usersTable.id],
		references: [userAddressTable.userId]
	})
}));

export const createUserSchema = createInsertSchema(usersTable);
export const selectUserSchema = createSelectSchema(usersTable);

export type SelectUser = InferSelectModel<typeof usersTable>;
export type InsertUser = InferInsertModel<typeof usersTable>;
export type Role = SelectUser['role'];
export type GeneralRole = Extract<Role, 'customer' | 'admin'> | 'moderator';
