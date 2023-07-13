import { relations } from 'drizzle-orm';
import { mysqlTable, serial, int, smallint } from 'drizzle-orm/mysql-core';
import { products } from './products';
// import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { carts } from './carts';

export const cartProducts = mysqlTable('cart_products', {
	id: serial('id').primaryKey().autoincrement(),

	quantity: smallint('quantity').notNull(),

	// relations
	productId: int('product_id').notNull(),
	cartId: int('cart_id').notNull()
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
