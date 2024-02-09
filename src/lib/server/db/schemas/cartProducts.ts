import { relations } from 'drizzle-orm';
import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import { products } from './products';
import { carts } from './carts';

export const cartProducts = sqliteTable('cart_products', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),

	quantity: integer('quantity', { mode: 'number' }).notNull(),

	// relations
	productId: integer('product_id', { mode: 'number' })
		.notNull()
		.references(() => products.id),
	cartId: integer('cart_id', { mode: 'number' })
		.notNull()
		.references(() => carts.id)
});

export const cartProductsRelations = relations(cartProducts, ({ one }) => ({
	cart: one(carts, {
		fields: [cartProducts.cartId],
		references: [carts.id]
	}),
	product: one(products, {
		fields: [cartProducts.productId],
		references: [products.id]
	})
}));
