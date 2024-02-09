import { deliveryMethods, orderStatus, paymentMethods } from '../../../client/constants/dbTypes';

import { relations, type InferSelectModel, type InferInsertModel, sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
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

export const orders = sqliteTable(
	'orders',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),

		// Order data
		price: real('price').notNull(), // price with discount included
		// noDiscountPrice: decimal('no_discount_price', { precision: 8, scale: 2 }).notNull(),
		discount: real('discount').notNull(),

		status: text('status', {
			enum: orderStatus
		}).notNull(),
		paid: integer('paid', { mode: 'boolean' }).default(false).notNull(),

		estimatedDeliveryDate: integer('estimated_delivery_date', { mode: 'timestamp' }),
		deliveryMethod: text('delivery_method', { enum: deliveryMethods }).notNull(),
		paymentMethod: text('payment_method', { enum: paymentMethods }).notNull(),

		// relations
		customerId: text('customer_id', { length: 36 }).notNull(),
		cartOwnerId: text('cart_owner_id', { length: 36 }).notNull(),
		driverId: text('driver_id', { length: 36 })
		// promoCodeId: int('promo_code_id'),
	},
	(order) => ({
		// indexes
		customerId: index('order_customer_idx').on(order.customerId),
		cartOwnerId: index('order_cart_owner_idx').on(order.cartOwnerId),
		// promoCodeId: index('order_promo_code_idx').on(order.promoCodeId),
		driverId: index('order_driver_idx').on(order.driverId)
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

export type SelectOrder = InferSelectModel<typeof orders>;
export type InsertOrder = InferInsertModel<typeof orders>;
