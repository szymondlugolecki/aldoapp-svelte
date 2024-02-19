import { relations, type InferSelectModel, type InferInsertModel, sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { usersTable } from './users';
// import { PushSubscription } from 'web-push-edge';

export interface PushSubscription {
	endpoint: string;
	expirationTime?: number | null;
	keys: {
		p256dh: string;
		auth: string;
	};
}

// interface PushSubscriptionJSON {
// 	endpoint?: string;
// 	expirationTime?: EpochTimeStamp | null;
// 	keys?: Record<string, string>;
// }

export const subscriptionsTable = sqliteTable(
	'subscriptions',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),

		// Subscription data
		expirationTime: integer('expiration_time', { mode: 'timestamp_ms' }),
		keys: text('keys', { mode: 'json' }).$type<PushSubscription['keys']>().notNull(),
		endpoint: text('endpoint', { length: 512 }).notNull(),

		// Tracking data
		userAgent: text('user_agent', { length: 512 }).notNull(),

		// relations
		userId: text('user_id')
			.notNull()
			.references(() => usersTable.id)
	},
	(subscription) => ({
		// indexes
		subEndpoint: uniqueIndex('subscription_endpointx').on(subscription.endpoint)
	})
);

export const subscriptionsRelations = relations(subscriptionsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [subscriptionsTable.userId],
		references: [usersTable.id]
	})
}));

export type SelectSubscription = InferSelectModel<typeof subscriptionsTable>;
export type InsertSubscription = InferInsertModel<typeof subscriptionsTable>;
