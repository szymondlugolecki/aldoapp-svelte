import { relations, sql, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { usersTable } from './users';

export const verificationTokensTable = sqliteTable(
	'verification_tokens',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),

		// Token data
		// token: varchar('token', { length: 72 }).notNull(),
		code: text('code', { length: 4 }).notNull(),
		userAgent: text('user_agent', { length: 512 }).notNull(),
		ipAddress: text('ip_address', { length: 96 }).notNull(),
		expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),

		// relations
		userId: text('user_id')
			.notNull()
			.references(() => usersTable.id)
	},
	(verificationToken) => ({
		// indexes
		// token: uniqueIndex('unique_tokenx').on(verificationToken.token),
		code: index('codex').on(verificationToken.code),
		userAgent: index('user_agentx').on(verificationToken.userAgent)
	})
);

export const verificationTokensRelations = relations(verificationTokensTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [verificationTokensTable.userId],
		references: [usersTable.id],
		relationName: 'verification_tokens'
	})
}));

export const createVerificationTokenSchema = createInsertSchema(verificationTokensTable);
export const selectVerificationTokenSchema = createSelectSchema(verificationTokensTable);

export type SelectVerificationToken = InferSelectModel<typeof verificationTokensTable>;
export type InsertVerificationToken = InferInsertModel<typeof verificationTokensTable>;
