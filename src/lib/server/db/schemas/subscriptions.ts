import { relations, type InferModel } from 'drizzle-orm';
import {
	mysqlTable,
	varchar,
	timestamp,
	json,
	serial,
	char,
	uniqueIndex
} from 'drizzle-orm/mysql-core';
import { users } from './users';

export const subscriptions = mysqlTable(
	'subscriptions',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').onUpdateNow().notNull(),

		// subscription data
		subscription: json('subscription').$type<PushSubscriptionJSON>().notNull(),
		endpoint: varchar('endpoint', { length: 767 }).notNull(),

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
