import { relations } from 'drizzle-orm';
import { mysqlTable, serial, int, smallint, decimal } from 'drizzle-orm/mysql-core';
import { products } from './products';
// import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { orders } from './orders';

export const orderProducts = mysqlTable('order_products', {
	id: serial('id').primaryKey().autoincrement(),

	quantity: smallint('quantity').notNull(),
	price: decimal('price', { precision: 8, scale: 2 }).notNull(),

	// relations
	productId: int('product_id').notNull(),
	orderId: int('order_id').notNull()
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
