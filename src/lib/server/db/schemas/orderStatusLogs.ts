import { relations, type InferSelectModel, type InferInsertModel, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { orders } from './orders';
import { users } from './users';
import { orderEvents } from '../../../client/constants/dbTypes';

export const orderStatusLogs = sqliteTable('order_status_logs', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),

	// Event
	event: text('event', { enum: ['CREATED', ...orderEvents] }).notNull(),
	createdAt: integer('timestamp', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),

	// relations
	orderId: integer('order_id', { mode: 'number' })
		.notNull()
		.references(() => orders.id),
	userId: integer('user_id', { mode: 'number' })
		.notNull()
		.references(() => users.id) // user responsible for this status change
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

export type SelectOrderStatusLogs = InferSelectModel<typeof orderStatusLogs>;
export type InsertOrderStatusLogs = InferInsertModel<typeof orderStatusLogs>;
