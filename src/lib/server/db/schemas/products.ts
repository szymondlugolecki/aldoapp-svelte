import {
	deliveryMethods,
	deliveryStatus,
	mainCategories,
	orderStatus,
	paymentMethods,
	paymentStatus,
	producents
} from '../../../client/constants/dbTypes';
// '$lib/client/constants/dbTypes';
import { sql, type InferModel } from 'drizzle-orm';
import {
	mysqlTable,
	serial,
	uniqueIndex,
	varchar,
	timestamp,
	text,
	int,
	json,
	float
} from 'drizzle-orm/mysql-core';

type OrderProductObj = {
	productId: number;
	quantity: number;
};

type Address = {
	email: string;
	street: string;
	zipCode: string;
	city: string;
	phone: string;
};

export const products = mysqlTable(
	'products',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at')
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		// updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),

		// Product info
		name: varchar('name', { length: 255 }).notNull(),
		description: varchar('description', { length: 2048 }),
		symbol: varchar('symbol', { length: 255 }).notNull(),
		category: varchar('category', { length: 255, enum: mainCategories }).notNull(),
		subcategory: varchar('subcategory', { length: 255 }).notNull(),
		price: float('price').notNull(),
		weight: float('weight').notNull(),
		amountLeft: int('amount_left').notNull(),
		producent: varchar('producent', { length: 255, enum: producents }).notNull(),
		images: json('images').$type<string[]>().default([]).notNull(),

		// relations
		authorId: varchar('user_id', { length: 36 }).notNull(), // user that added this product
		// .references(() => users.id),
		encodedURL: varchar('encoded_url', { length: 255 }).notNull()
	},
	(product) => ({
		// indexes
		authorId: uniqueIndex('author_id').on(product.authorId)
	})
);

export const orders = mysqlTable(
	'orders',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at')
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		// updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),

		// order data
		paymentStatus: text('status', {
			enum: paymentStatus
		}).notNull(),
		status: text('status', {
			enum: orderStatus
		}).notNull(),
		deliveryStatus: text('status', {
			enum: deliveryStatus
		}).notNull(),
		address: json('address').$type<Address>(),
		customerName: varchar('name', { length: 256 }).notNull(),

		deliveryMethod: text('delivery_method', { enum: deliveryMethods }).notNull(),
		paymentMethod: text('payment_method', { enum: paymentMethods }).notNull(),

		products: json('products').$type<OrderProductObj[]>().notNull(),

		// relations
		customerId: varchar('customer_id', { length: 36 }).notNull(),
		// .references(() => users.id),
		promoCodeId: int('promo_code_id')
		// .references(() => promoCodes.id)
	},
	(order) => ({
		// indexes
		customerId: uniqueIndex('unique_customer_idx').on(order.customerId),
		promoCodeId: uniqueIndex('unique_promo_code_idx').on(order.promoCodeId)
	})
);

export type Product = InferModel<typeof products>;
export type Order = InferModel<typeof orders>;

// export const orderProducts = mysqlTable('order_products', {
// 	id: serial('id').primaryKey().autoincrement(),

// 	// order product data
// 	productId: int('product_id').references(() => products.id),
// 	quantity: tinyint('quantity').notNull()
// });
