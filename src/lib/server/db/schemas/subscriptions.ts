import { sql, type InferModel } from 'drizzle-orm';
import {
	mysqlTable,
	uniqueIndex,
	varchar,
	timestamp,
	json,
	serial,
	char
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
		endpoint: varchar('endpoint', { length: 2048 }).notNull(),
		userId: char('user_id').notNull()
		// .references(() => users.id)
	},
	(subscription) => ({
		// indexes
		subId: uniqueIndex('subscription_idx').on(subscription.id)
		// subEndpoint: index('subscription_endpointx').on(subscription.endpoint)
	})
);

export type Subscription = InferModel<typeof subscriptions>;
