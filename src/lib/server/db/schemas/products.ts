import { mainCategories, producents } from '../../../client/constants/dbTypes';
import { relations, sql, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { sqliteTable, integer, text, index, real } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { orderProducts } from './orderProducts';
import { cartProducts } from './cartProducts';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { images } from './images';
import { favoriteProducts } from './favoriteProducts';

export type Customer = {
	email: string;
	phone: string;
	fullName: string;
};

export const products = sqliteTable(
	'products',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),

		// Product info
		name: text('name', { length: 255 }).notNull(),
		description: text('description', { length: 2048 }),
		symbol: text('symbol', { length: 255 }).notNull(),
		subcategory: text('subcategory', { length: 255 }),
		category: text('category', { length: 255, enum: mainCategories }).notNull(),
		price: real('price').notNull(),
		weight: real('weight').notNull(),
		amountLeft: integer('amount_left', { mode: 'number' }).notNull(),
		producent: text('producent', { length: 255, enum: producents }).notNull(),
		encodedURL: text('encoded_url', { length: 512 }).notNull(),
		image: text('image', { length: 2048 }),
		hidden: integer('hidden', { mode: 'boolean' }).default(false).notNull(),

		// relations
		authorId: text('author_id', { length: 36 })
			.notNull()
			.references(() => users.id) // user that added this product
	},
	(product) => ({
		// indexes
		authorId: index('products_author_idx').on(product.authorId),
		name: index('products_name_idx').on(product.name),
		symbol: index('products_symbol_idx').on(product.symbol)
	})
);

export const productsRelations = relations(products, ({ one, many }) => ({
	author: one(users, {
		fields: [products.authorId],
		references: [users.id],
		relationName: 'products'
	}),
	orderProducts: many(orderProducts),
	cartProducts: many(cartProducts),
	images: many(images),
	favoriteProducts: many(favoriteProducts, { relationName: 'favorite_products' })
}));

export const createProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);

export type SelectProduct = InferSelectModel<typeof products>;
export type InsertProduct = InferInsertModel<typeof products>;
