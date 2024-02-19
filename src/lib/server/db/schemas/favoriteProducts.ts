import { relations } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { productsTable } from './products';
import { usersTable } from './users';
// import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const favoriteProductsTable = sqliteTable('favorite_products', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),

	// relations
	productId: integer('product_id', { mode: 'number' })
		.notNull()
		.references(() => productsTable.id),
	userId: text('author_id')
		.notNull()
		.references(() => usersTable.id)
});

export const favoriteProductsRelations = relations(favoriteProductsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [favoriteProductsTable.userId],
		references: [usersTable.id],
		relationName: 'favorite_products_user'
	}),
	product: one(productsTable, {
		fields: [favoriteProductsTable.productId],
		references: [productsTable.id],
		relationName: 'favorite_products'
	})
}));
