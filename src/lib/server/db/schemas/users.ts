import { userRoles } from '../../../client/constants/dbTypes';
import { relations, type InferModel } from 'drizzle-orm';
import {
	mysqlTable,
	uniqueIndex,
	varchar,
	char,
	boolean,
	timestamp,
	text,
	index
} from 'drizzle-orm/mysql-core';
import { verificationTokens } from './verificationTokens';
import { orders } from './orders';
import { products } from './products';
import { subscriptions } from './subscriptions';
import { promoCodes } from './promoCodes';

export const users = mysqlTable(
	'users',
	{
		id: char('id', { length: 255 }).primaryKey(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').onUpdateNow().notNull(),

		// User data
		email: varchar('email', { length: 320 }).notNull(),
		fullName: varchar('name', { length: 256 }).notNull(),
		role: text('role', { enum: userRoles }).notNull(),
		access: boolean('access').default(true).notNull(),
		phone: char('phone', { length: 15 }).notNull(),

		// relations
		assignedAdviser: char('assigned_adviser', { length: 255 })
	},
	(user) => ({
		// indexes
		email: uniqueIndex('unique_emailx').on(user.email),
		assignedAdviser: index('assigned_adviserx').on(user.assignedAdviser)
	})
);

export const usersRelations = relations(users, ({ many }) => ({
	verificationTokens: many(verificationTokens),
	orders: many(orders),
	products: many(products), // authored products
	subscriptions: many(subscriptions),
	promoCodes: many(promoCodes)
}));

export type User = InferModel<typeof users>;
export type VerificationToken = InferModel<typeof verificationTokens>;
export type Role = User['role'];
export type GeneralRole = Extract<Role, 'customer' | 'admin'> | 'moderator';
