import { relations } from 'drizzle-orm';
import { sqliteTable, integer, real } from 'drizzle-orm/sqlite-core';
import { products } from './products';
import { orders } from './orders';

export const orderProducts = sqliteTable('order_products', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),

	quantity: integer('quantity').notNull(),
	price: real('price').notNull(),

	// relations
	productId: integer('product_id')
		.notNull()
		.references(() => products.id),
	orderId: integer('order_id')
		.notNull()
		.references(() => orders.id)
});

export const orderProductsRelations = relations(orderProducts, ({ one }) => ({
	order: one(orders, {
		fields: [orderProducts.orderId],
		references: [orders.id],
		relationName: 'order_products'
	}),
	product: one(products, {
		fields: [orderProducts.productId],
		references: [products.id]
	})
}));
