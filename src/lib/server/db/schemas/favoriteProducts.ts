import { relations } from 'drizzle-orm';
import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import { products } from './products';
import { users } from './users';
// import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const favoriteProducts = sqliteTable('favorite_products', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),

	// relations
	productId: integer('product_id', { mode: 'number' })
		.notNull()
		.references(() => products.id),
	userId: integer('author_id', { mode: 'number' })
		.notNull()
		.references(() => users.id)
});

export const favoriteProductsRelations = relations(favoriteProducts, ({ one }) => ({
	user: one(users, {
		fields: [favoriteProducts.userId],
		references: [users.id],
		relationName: 'favorite_products_user'
	}),
	product: one(products, {
		fields: [favoriteProducts.productId],
		references: [products.id],
		relationName: 'favorite_products'
	})
}));
