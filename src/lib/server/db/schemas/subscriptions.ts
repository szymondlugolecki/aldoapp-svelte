import { sql, type InferModel } from 'drizzle-orm';
import {
	mysqlTable,
	varchar,
	timestamp,
	json,
	serial,
	char,
	uniqueIndex
} from 'drizzle-orm/mysql-core';
// import { users } from './users';

export const subscriptions = mysqlTable(
	'subscriptions',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at')
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		// updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),

		// subscription data
		subscription: json('subscription').$type<PushSubscriptionJSON>().notNull(),
		endpoint: varchar('endpoint', { length: 767 }).notNull(),
		userId: char('user_id', { length: 255 }).notNull()
		// .references(() => users.id)
	},
	(subscription) => ({
		// indexes
		subEndpoint: uniqueIndex('subscription_endpointx').on(subscription.endpoint)
	})
);

export type Subscription = InferModel<typeof subscriptions>;
