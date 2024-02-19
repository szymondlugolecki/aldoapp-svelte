import { relations, type InferSelectModel, type InferInsertModel, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { ordersTable } from './orders';
import { usersTable } from './users';
import { orderEvents } from '../../../client/constants/dbTypes';

export const orderStatusLogsTable = sqliteTable('order_status_logs', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),

	// Event
	event: text('event', { enum: ['CREATED', ...orderEvents] }).notNull(),
	createdAt: integer('timestamp', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),

	// relations
	orderId: text('order_id')
		.notNull()
		.references(() => ordersTable.id),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id) // user responsible for this status change
});

export const orderStatusLogsRelations = relations(orderStatusLogsTable, ({ one }) => ({
	order: one(ordersTable, {
		fields: [orderStatusLogsTable.orderId],
		references: [ordersTable.id],
		relationName: 'order_status_logs'
	}),
	user: one(usersTable, {
		fields: [orderStatusLogsTable.userId],
		references: [usersTable.id]
	})
}));

export type SelectOrderStatusLogs = InferSelectModel<typeof orderStatusLogsTable>;
export type InsertOrderStatusLogs = InferInsertModel<typeof orderStatusLogsTable>;
