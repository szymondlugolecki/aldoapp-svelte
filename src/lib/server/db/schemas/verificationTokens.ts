import { relations, sql, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from './users';

export const verificationTokens = sqliteTable(
	'verification_tokens',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),

		// Token data
		// token: varchar('token', { length: 72 }).notNull(),
		code: text('code', { length: 4 }).notNull(),
		userAgent: text('user_agent', { length: 512 }).notNull(),
		// ipAddress: varchar('ip_address', { length: 46 }).notNull(),
		expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),

		// relations
		userId: integer('user_id', { mode: 'number' })
			.notNull()
			.references(() => users.id)
	},
	(verificationToken) => ({
		// indexes
		// token: uniqueIndex('unique_tokenx').on(verificationToken.token),
		code: index('codex').on(verificationToken.code),
		userAgent: index('user_agentx').on(verificationToken.userAgent)
	})
);

export const verificationTokensRelations = relations(verificationTokens, ({ one }) => ({
	user: one(users, { fields: [verificationTokens.userId], references: [users.id] })
}));

export const createVerificationTokenSchema = createInsertSchema(verificationTokens);
export const selectVerificationTokenSchema = createSelectSchema(verificationTokens);

export type SelectVerificationToken = InferSelectModel<typeof verificationTokens>;
export type InsertVerificationToken = InferInsertModel<typeof verificationTokens>;
