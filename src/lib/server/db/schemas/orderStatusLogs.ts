import { relations, type InferModel } from 'drizzle-orm';
import { mysqlTable, varchar, serial, timestamp, mysqlEnum, int } from 'drizzle-orm/mysql-core';
import { orders } from './orders';
import { users } from './users';
import { orderEvents } from '../../../client/constants/dbTypes';

export const orderStatusLogs = mysqlTable('order_status_logs', {
	id: serial('id').primaryKey().autoincrement(),

	// event
	event: mysqlEnum('event', ['CREATED', ...orderEvents]).notNull(),
	timestamp: timestamp('timestamp').notNull(),

	// relations
	orderId: int('order_id').notNull(),
	userId: varchar('user_id', { length: 36 }).notNull() // user responsible for this status change
});

export const orderStatusLogsRelations = relations(orderStatusLogs, ({ one }) => ({
	order: one(orders, {
		fields: [orderStatusLogs.orderId],
		references: [orders.id],
		relationName: 'order_status_logs'
	}),
	user: one(users, {
		fields: [orderStatusLogs.userId],
		references: [users.id]
	})
}));

export type OrderStatusLogs = InferModel<typeof orderStatusLogs>;
