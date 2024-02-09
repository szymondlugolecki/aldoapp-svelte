import { relations, type InferSelectModel, type InferInsertModel, sql } from 'drizzle-orm';
import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { products } from './products';
import { users } from './users';

export const images = sqliteTable(
	'images',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),

		url: text('url', { length: 512 }).notNull(),

		// relations
		productId: integer('product_id', { mode: 'number' })
			.notNull()
			.references(() => products.id),
		authorId: integer('author_id', { mode: 'number' })
			.notNull()
			.references(() => users.id) // user who added the image
	},
	(product) => ({
		// indexes
		authorId: index('images_author_idx').on(product.authorId)
	})
);

export const imagesRelations = relations(images, ({ one }) => ({
	images: one(products, {
		fields: [images.productId],
		references: [products.id]
	})
}));

export const createImageSchema = createInsertSchema(images);
export const selectImageSchema = createSelectSchema(images);

export type SelectImage = InferSelectModel<typeof images>;
export type InsertImage = InferInsertModel<typeof images>;
