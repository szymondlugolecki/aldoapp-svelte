import { deliveryMethods, orderStatus, paymentMethods } from '../../../client/constants/dbTypes';

import { relations, type InferModel } from 'drizzle-orm';
import {
	mysqlTable,
	serial,
	varchar,
	timestamp,
	text,
	index,
	decimal,
	boolean
} from 'drizzle-orm/mysql-core';
import { users } from './users';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { orderProducts } from './orderProducts';
import { orderAddress } from './orderAddress';
import { orderStatusLogs } from './orderStatusLogs';

export type Address = {
	street: string;
	zipCode: string;
	city: string;
};

export const orders = mysqlTable(
	'orders',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at').notNull(),

		// Order data
		price: decimal('price', { precision: 8, scale: 2 }).notNull(), // price with discount included
		// noDiscountPrice: decimal('no_discount_price', { precision: 8, scale: 2 }).notNull(),
		discount: decimal('discount', { precision: 8, scale: 2 }).notNull(),

		status: text('status', {
			enum: orderStatus
		}).notNull(),
		paid: boolean('paid').default(false).notNull(),

		estimatedDeliveryDate: timestamp('estimated_delivery_date'),
		deliveryMethod: text('delivery_method', { enum: deliveryMethods }).notNull(),
		paymentMethod: text('payment_method', { enum: paymentMethods }).notNull(),

		// relations
		customerId: varchar('customer_id', { length: 36 }).notNull(),
		cartOwnerId: varchar('cart_owner_id', { length: 36 }).notNull(),
		// promoCodeId: int('promo_code_id'),
		driverId: varchar('driver_id', { length: 36 })
	},
	(order) => ({
		// indexes
		customerId: index('customer_idx').on(order.customerId),
		cartOwnerId: index('cart_owner_idx').on(order.cartOwnerId),
		// promoCodeId: index('promo_code_idx').on(order.promoCodeId),
		driverId: index('driver_idx').on(order.driverId)
	})
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
	customer: one(users, {
		fields: [orders.customerId],
		references: [users.id],
		relationName: 'order_customer'
	}),
	cartOwner: one(users, {
		fields: [orders.cartOwnerId],
		references: [users.id],
		relationName: 'order_cart_owner'
	}),
	driver: one(users, {
		fields: [orders.driverId],
		references: [users.id],
		relationName: 'order_driver'
	}),
	// promoCode: one(promoCodes, {
	// 	fields: [orders.promoCodeId],
	// 	references: [promoCodes.id]
	// }),
	products: many(orderProducts, { relationName: 'order_products' }),
	statusLogs: many(orderStatusLogs, { relationName: 'order_status_logs' }),
	address: one(orderAddress, {
		fields: [orders.id],
		references: [orderAddress.orderId]
	})
}));

export const createOrderSchema = createInsertSchema(orders);
export const selectOrderSchema = createSelectSchema(orders);

export type Order = InferModel<typeof orders>;
