import { sql } from 'drizzle-orm';
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
// import { promoCodes } from './promoCodes';
// import { users } from './users';

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
		createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
		// updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),

		// Product info
		name: varchar('name', { length: 255 }).notNull(),
		description: varchar('description', { length: 255 }),
		symbol: varchar('symbol', { length: 255 }).notNull(),
		category: varchar('category', { length: 255 }).notNull(),
		subcategory: varchar('subcategory', { length: 255 }).notNull(),
		price: float('price').notNull(),
		weight: float('weight').notNull(),
		amountLeft: int('amount_left').notNull(),
		producent: varchar('producent', { length: 255 }).notNull(),

		// relations
		userId: varchar('user_id', { length: 36 }).notNull(),
		// .references(() => users.id),
		encodedURL: varchar('encoded_url', { length: 255 }).notNull()
	},
	(product) => ({
		// indexes
		userId: uniqueIndex('user_id').on(product.userId)
	})
);

export const orders = mysqlTable(
	'orders',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
		// updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),

		// order data
		status: text('status', { enum: ['pending', 'processing', 'completed', 'cancelled'] }).notNull(),
		address: json('address').$type<Address | Record<string, never>>(),
		customerName: varchar('name', { length: 256 }).notNull(),

		products: json('products').$type<OrderProductObj[]>().notNull(),

		// relations
		customerId: int('customer_id').notNull(),
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

// export const orderProducts = mysqlTable('order_products', {
// 	id: serial('id').primaryKey().autoincrement(),

// 	// order product data
// 	productId: int('product_id').references(() => products.id),
// 	quantity: tinyint('quantity').notNull()
// });
