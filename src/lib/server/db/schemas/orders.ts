import {
	deliveryMethods,
	deliveryStatus,
	orderStatus,
	paymentMethods,
	paymentStatus
} from '../../../client/constants/dbTypes';

import { relations, type InferModel } from 'drizzle-orm';
import {
	mysqlTable,
	serial,
	varchar,
	timestamp,
	text,
	int,
	json,
	index,
	decimal
} from 'drizzle-orm/mysql-core';
import { users } from './users';
import { promoCodes } from './promoCodes';
import { products } from './products';

type OrderProductObj = { [productId: number]: number };

export type Address = {
	street: string;
	zipCode: string;
	city: string;
};

export const orders = mysqlTable(
	'orders',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').onUpdateNow().notNull(),

		// Order data
		price: decimal('price', { precision: 8, scale: 2 }).notNull(), // price with discount included
		discount: decimal('discount', { precision: 8, scale: 2 }).notNull(),
		paymentStatus: text('payment_status', {
			enum: paymentStatus
		}).notNull(),
		status: text('status', {
			enum: orderStatus
		}).notNull(),
		deliveryStatus: text('delivery_status', {
			enum: deliveryStatus
		}).notNull(),
		address: json('address').$type<Address>(),

		estimatedDeliveryDate: timestamp('estimated_delivery_date'),
		deliveryMethod: text('delivery_method', { enum: deliveryMethods }).notNull(),
		paymentMethod: text('payment_method', { enum: paymentMethods }).notNull(),

		productsQuantity: json('products_quantity').$type<OrderProductObj[]>().notNull(),
		// relations
		orderedProductsIds: int('ordered_products_ids'),
		customerId: varchar('customer_id', { length: 36 }).notNull(),
		promoCodeId: int('promo_code_id'),
		driverId: varchar('driver_id', { length: 36 })
	},
	(order) => ({
		// indexes
		customerId: index('customer_idx').on(order.customerId),
		promoCodeId: index('promo_code_idx').on(order.promoCodeId),
		driverId: index('driver_idx').on(order.driverId)
	})
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
	customer: one(users, {
		fields: [orders.customerId],
		references: [users.id]
	}),
	driver: one(users, {
		fields: [orders.driverId],
		references: [users.id]
	}),
	promoCode: one(promoCodes, {
		fields: [orders.promoCodeId],
		references: [promoCodes.id]
	}),
	orderedProducts: many(products)
}));

export type Order = InferModel<typeof orders>;
