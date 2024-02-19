import { type InferSelectModel, type InferInsertModel, relations } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { ordersTable } from './orders';

export const orderAddressTable = sqliteTable('order_address', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),

	// address
	zipCode: text('zip_code', { length: 10 }).notNull(),
	street: text('street', { length: 255 }).notNull(),
	city: text('city', { length: 255 }).notNull(),

	// relations
	orderId: text('order_id')
		.notNull()
		.references(() => ordersTable.id)
});

export const addressRelations = relations(orderAddressTable, ({ one }) => ({
	order: one(ordersTable, {
		fields: [orderAddressTable.orderId],
		references: [ordersTable.id]
	})
}));

export type SelectOrderAddress = InferSelectModel<typeof orderAddressTable>;
export type InsertOrderAddress = InferInsertModel<typeof orderAddressTable>;
