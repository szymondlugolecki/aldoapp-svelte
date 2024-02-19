import { relations, type InferSelectModel, type InferInsertModel, sql } from 'drizzle-orm';
import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { productsTable } from './products';
import { usersTable } from './users';

export const imagesTable = sqliteTable(
	'images',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),

		url: text('url', { length: 1024 }).notNull(),

		// relations
		productId: integer('product_id', { mode: 'number' })
			.notNull()
			.references(() => productsTable.id),
		authorId: text('author_id')
			.notNull()
			.references(() => usersTable.id) // user who added the image
	},
	(product) => ({
		// indexes
		authorId: index('images_author_idx').on(product.authorId)
	})
);

export const imagesRelations = relations(imagesTable, ({ one }) => ({
	images: one(productsTable, {
		fields: [imagesTable.productId],
		references: [productsTable.id]
	})
}));

export const createImageSchema = createInsertSchema(imagesTable);
export const selectImageSchema = createSelectSchema(imagesTable);

export type SelectImage = InferSelectModel<typeof imagesTable>;
export type InsertImage = InferInsertModel<typeof imagesTable>;
