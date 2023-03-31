import { sql } from 'drizzle-orm';
import {
	mysqlTable,
	serial,
	uniqueIndex,
	varchar,
	char,
	boolean,
	timestamp,
	text,
	int,
	index
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable(
	'users',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
		// updatedAt: timestamp('created_at').notNull().defaultNow().onUpdateNow(),

		// user data
		email: varchar('email', { length: 320 }).notNull(),
		fullName: varchar('name', { length: 256 }),
		role: text('role', { enum: ['admin', 'moderator', 'customer'] }).notNull(),
		banned: boolean('banned').default(false).notNull()

		// relations
	},
	(user) => ({
		// indexes
		email: uniqueIndex('unique_emailx').on(user.email)
	})
);

export const verificationTokens = mysqlTable(
	'verification_tokens',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),

		// token data
		token: varchar('token', { length: 72 }).notNull(),
		code: char('code', { length: 4 }).notNull(),
		userAgent: varchar('user_agent', { length: 400 }).notNull(),
		// ipAddress: varchar('ip_address', { length: 46 }).notNull(),
		expiresAt: timestamp('expires_at').notNull(),

		// relations
		userId: int('user_id').notNull()
		// .references(() => users.id)
	},
	(verificationToken) => ({
		// indexes
		token: uniqueIndex('unique_tokenx').on(verificationToken.token),
		code: index('unique_codex').on(verificationToken.code),
		userAgent: index('unique_user_agentx').on(verificationToken.userAgent)
	})
);
