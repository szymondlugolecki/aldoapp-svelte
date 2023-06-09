import { relations } from 'drizzle-orm';
import {
	mysqlTable,
	serial,
	uniqueIndex,
	varchar,
	char,
	timestamp,
	index
} from 'drizzle-orm/mysql-core';
import { users } from './users';

export const verificationTokens = mysqlTable(
	'verification_tokens',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').onUpdateNow().notNull(),

		// token data
		token: varchar('token', { length: 72 }).notNull(),
		code: char('code', { length: 4 }).notNull(),
		userAgent: varchar('user_agent', { length: 400 }).notNull(),
		// ipAddress: varchar('ip_address', { length: 46 }).notNull(),
		expiresAt: timestamp('expires_at').notNull(),

		// relations
		userId: char('user_id', { length: 255 }).notNull()
	},
	(verificationToken) => ({
		// indexes
		token: uniqueIndex('unique_tokenx').on(verificationToken.token),
		code: index('codex').on(verificationToken.code),
		userAgent: index('user_agentx').on(verificationToken.userAgent)
	})
);

export const verificationTokensRelations = relations(verificationTokens, ({ one }) => ({
	user: one(users, { fields: [verificationTokens.userId], references: [users.id] })
}));
