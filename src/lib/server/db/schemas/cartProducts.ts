import { relations } from 'drizzle-orm';
import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import { productsTable } from './products';
import { cartsTable } from './carts';

export const cartProductsTable = sqliteTable('cart_products', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),

	quantity: integer('quantity', { mode: 'number' }).notNull(),

	// relations
	productId: integer('product_id', { mode: 'number' })
		.notNull()
		.references(() => productsTable.id),
	cartId: integer('cart_id', { mode: 'number' })
		.notNull()
		.references(() => cartsTable.id)
});

export const cartProductsRelations = relations(cartProductsTable, ({ one }) => ({
	cart: one(cartsTable, {
		fields: [cartProductsTable.cartId],
		references: [cartsTable.id]
	}),
	product: one(productsTable, {
		fields: [cartProductsTable.productId],
		references: [productsTable.id]
	})
}));
