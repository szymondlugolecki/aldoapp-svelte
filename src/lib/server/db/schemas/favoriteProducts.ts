import { relations } from 'drizzle-orm';
import { mysqlTable, int, varchar } from 'drizzle-orm/mysql-core';
import { products } from './products';
import { users } from './users';
// import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const favoriteProducts = mysqlTable('favorite_products', {
	// relations
	productId: int('product_id').notNull(),
	userId: varchar('author_id', { length: 36 }).notNull()
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
