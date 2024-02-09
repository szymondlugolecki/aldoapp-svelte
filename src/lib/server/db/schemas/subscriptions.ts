import { relations, type InferSelectModel, type InferInsertModel, sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import type { PushSubscription } from '@block65/webcrypto-web-push';

// interface PushSubscriptionJSON {
// 	endpoint?: string;
// 	expirationTime?: EpochTimeStamp | null;
// 	keys?: Record<string, string>;
// }

export const subscriptions = sqliteTable(
	'subscriptions',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),

		// Subscription data
		expirationTime: integer('expiration_time', { mode: 'timestamp' }),
		keys: text('keys', { mode: 'json' }).$type<PushSubscription['keys']>().notNull(),
		endpoint: text('endpoint', { length: 512 }).notNull(),

		// Tracking data
		userAgent: text('user_agent', { length: 512 }).notNull(),

		// relations
		userId: text('user_id', { length: 255 })
			.notNull()
			.references(() => users.id)
	},
	(subscription) => ({
		// indexes
		subEndpoint: uniqueIndex('subscription_endpointx').on(subscription.endpoint)
	})
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
	user: one(users, {
		fields: [subscriptions.userId],
		references: [users.id]
	})
}));

export type SelectSubscription = InferSelectModel<typeof subscriptions>;
export type InsertSubscription = InferInsertModel<typeof subscriptions>;
