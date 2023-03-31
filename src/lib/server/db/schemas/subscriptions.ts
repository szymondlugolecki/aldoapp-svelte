import { sql } from 'drizzle-orm';
import {
	mysqlTable,
	uniqueIndex,
	varchar,
	timestamp,
	int,
	json,
	// index,
	serial
} from 'drizzle-orm/mysql-core';
// import { users } from './users';

export const subscriptions = mysqlTable(
	'subscriptions',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
		// updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),

		// subscription data
		subscription: json('subscription').$type<PushSubscription>().notNull(),
		endpoint: varchar('endpoint', { length: 2048 }).notNull(),
		userId: int('user_id').notNull()
		// .references(() => users.id)
	},
	(subscription) => ({
		// indexes
		subId: uniqueIndex('subscription_idx').on(subscription.id)
		// subEndpoint: index('subscription_endpointx').on(subscription.endpoint)
	})
);
