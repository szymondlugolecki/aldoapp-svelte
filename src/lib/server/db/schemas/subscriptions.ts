import { relations, type InferModel } from 'drizzle-orm';
import {
	mysqlTable,
	varchar,
	timestamp,
	json,
	serial,
	char,
	uniqueIndex,
	mediumint
} from 'drizzle-orm/mysql-core';
import { users } from './users';
import type { PushSubscription } from '@block65/webcrypto-web-push/dist/lib/types';

// interface PushSubscriptionJSON {
// 	endpoint?: string;
// 	expirationTime?: EpochTimeStamp | null;
// 	keys?: Record<string, string>;
// }

export const subscriptions = mysqlTable(
	'subscriptions',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at').notNull(),

		// Subscription data
		expirationTime: mediumint('expiration_time'),
		keys: json('keys').$type<PushSubscription['keys']>().notNull(),
		endpoint: varchar('endpoint', { length: 512 }).notNull(),

		// Tracking data
		userAgent: varchar('user_agent', { length: 512 }).notNull(),

		// relations
		userId: char('user_id', { length: 255 }).notNull()
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

export type Subscription = InferModel<typeof subscriptions>;
