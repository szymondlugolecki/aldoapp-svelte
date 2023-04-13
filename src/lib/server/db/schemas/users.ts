import { userRoles } from '../../../client/constants/dbTypes';
import { sql, type InferModel } from 'drizzle-orm';
import {
	mysqlTable,
	serial,
	uniqueIndex,
	varchar,
	char,
	boolean,
	timestamp,
	text,
	index
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable(
	'users',
	{
		id: char('id', { length: 255 }).primaryKey(),
		createdAt: timestamp('created_at')
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		// updatedAt: timestamp('created_at').notNull().defaultNow().onUpdateNow(),

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

export const verificationTokens = mysqlTable(
	'verification_tokens',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at')
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),

		// token data
		token: varchar('token', { length: 72 }).notNull(),
		code: char('code', { length: 4 }).notNull(),
		userAgent: varchar('user_agent', { length: 400 }).notNull(),
		// ipAddress: varchar('ip_address', { length: 46 }).notNull(),
		expiresAt: timestamp('expires_at').notNull(),

		// relations
		userId: char('user_id', { length: 255 }).notNull()
		// .references(() => users.id)
	},
	(verificationToken) => ({
		// indexes
		token: uniqueIndex('unique_tokenx').on(verificationToken.token),
		code: index('codex').on(verificationToken.code),
		userAgent: index('user_agentx').on(verificationToken.userAgent)
	})
);

export type User = InferModel<typeof users>;
export type VerificationToken = InferModel<typeof verificationTokens>;
export type Role = User['role'];
export type GeneralRole = Extract<Role, 'customer' | 'admin'> | 'moderator';
