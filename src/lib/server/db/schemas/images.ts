import { relations, type InferModel } from 'drizzle-orm';
import { mysqlTable, serial, varchar, timestamp, index } from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { products } from './products';

export const images = mysqlTable(
	'images',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').onUpdateNow(),

		url: varchar('url', { length: 512 }).notNull(),

		// relations
		productId: varchar('product_id', { length: 36 }).notNull(),
		authorId: varchar('author_id', { length: 36 }).notNull() // user that added this image
	},
	(product) => ({
		// indexes
		authorId: index('author_idx').on(product.authorId)
	})
);

export const imagesRelations = relations(images, ({ one }) => ({
	images: one(products, {
		fields: [images.id],
		references: [products.imagesId]
	})
}));

export const createImageSchema = createInsertSchema(images);
export const selectImageSchema = createSelectSchema(images);

export type Image = InferModel<typeof images>;
