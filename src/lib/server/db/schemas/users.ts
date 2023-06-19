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
	index,
	json
} from 'drizzle-orm/mysql-core';
import { verificationTokens } from './verificationTokens';
import { orders, type Address } from './orders';
import { products } from './products';
import { subscriptions } from './subscriptions';
import { promoCodes } from './promoCodes';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = mysqlTable(
	'users',
	{
		id: char('id', { length: 255 }).primaryKey(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').onUpdateNow(),

		// User data
		email: varchar('email', { length: 320 }).notNull(),
		fullName: varchar('name', { length: 256 }).notNull(),
		role: text('role', { enum: userRoles }).notNull(),
		access: boolean('access').default(true).notNull(),
		phone: char('phone', { length: 15 }).notNull(),
		address: json('address').$type<Address>(),

		// relations
		adviserId: char('adviser_id', { length: 255 })
		// advisedId: char('advised_id', { length: 255 })
		// users_fulltext: text('fulltext').fulltextIndex()
	},
	(user) => ({
		email: uniqueIndex('unique_emailx').on(user.email),
		adviserId: index('adviser_idx').on(user.adviserId)
		// fullText: index('full_text').on(user.fullName, user.email, user.phone).using('fulltext')
	})
);

export const usersRelations = relations(users, ({ one, many }) => ({
	verificationTokens: many(verificationTokens),
	orders: many(orders),
	products: many(products), // authored products
	subscriptions: many(subscriptions),
	promoCodes: many(promoCodes),
	adviser: one(users, {
		fields: [users.adviserId],
		references: [users.id]
	})
	// advised: many(users)
}));

export const createUserSchema = createInsertSchema(users, {
	address: () =>
		z.object({
			city: z.string(),
			street: z.string(),
			zipCode: z.string()
		})
});
export const selectUserSchema = createSelectSchema(users);

export type User = InferModel<typeof users>;
export type Role = User['role'];
export type GeneralRole = Extract<Role, 'customer' | 'admin'> | 'moderator';
