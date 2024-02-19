import { relations } from 'drizzle-orm';
import { sqliteTable, integer, real, text } from 'drizzle-orm/sqlite-core';
import { productsTable } from './products';
import { ordersTable } from './orders';

export const orderProductsTable = sqliteTable('order_products', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),

	quantity: integer('quantity').notNull(),
	price: real('price').notNull(),

	// relations
	productId: integer('product_id')
		.notNull()
		.references(() => productsTable.id),
	orderId: text('order_id')
		.notNull()
		.references(() => ordersTable.id)
});

export const orderProductsRelations = relations(orderProductsTable, ({ one }) => ({
	order: one(ordersTable, {
		fields: [orderProductsTable.orderId],
		references: [ordersTable.id],
		relationName: 'order_products'
	}),
	product: one(productsTable, {
		fields: [orderProductsTable.productId],
		references: [productsTable.id]
	})
}));
