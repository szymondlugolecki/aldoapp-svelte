import {
	mainCategories,
	producents,
	type DeliveryStatus,
	type OrderStatus,
	type PaymentStatus
} from '../../../client/constants/dbTypes';
// '$lib/client/constants/dbTypes';
import { relations, type InferModel } from 'drizzle-orm';
import {
	mysqlTable,
	serial,
	varchar,
	timestamp,
	int,
	index,
	decimal
} from 'drizzle-orm/mysql-core';
import { users } from './users';
import { orderProducts } from './orderProducts';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { images } from './images';

export type Customer = {
	email: string;
	phone: string;
	fullName: string;
};

export type OrderHistoryEvent = {
	type: 'order' | 'delivery' | 'payment' | 'event';
	status: OrderStatus | DeliveryStatus | PaymentStatus | 'created';
	date: Date;
};

export const products = mysqlTable(
	'products',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').onUpdateNow(),

		// Product info
		name: varchar('name', { length: 255 }).notNull(),
		description: varchar('description', { length: 2048 }),
		symbol: varchar('symbol', { length: 255 }).notNull(),
		subcategory: varchar('subcategory', { length: 255 }),
		category: varchar('category', { length: 255, enum: mainCategories }).notNull(),
		price: decimal('price', { precision: 8, scale: 2 }).notNull(),
		weight: decimal('weight', { precision: 8, scale: 2 }).notNull(),
		amountLeft: int('amount_left').notNull(),
		producent: varchar('producent', { length: 255, enum: producents }).notNull(),
		encodedURL: varchar('encoded_url', { length: 512 }).notNull(),

		// relations
		authorId: varchar('author_id', { length: 36 }).notNull(), // user that added this product
		imagesId: int('images_id')
	},
	(product) => ({
		// indexes
		authorId: index('author_idx').on(product.authorId),
		name: index('name_idx').on(product.name),
		symbol: index('symbol_idx').on(product.symbol)
	})
);

export const productsRelations = relations(products, ({ one, many }) => ({
	author: one(users, {
		fields: [products.authorId],
		references: [users.id]
	}),
	orderProducts: many(orderProducts),
	images: many(images)
}));

export const createProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);

export type Product = InferModel<typeof products>;
