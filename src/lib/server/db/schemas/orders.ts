import { deliveryMethods, orderStatus, paymentMethods } from '../../../client/constants/dbTypes';

import { relations, type InferSelectModel, type InferInsertModel, sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { usersTable } from './users';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { orderProductsTable } from './orderProducts';
import { orderAddressTable } from './orderAddress';
import { orderStatusLogsTable } from './orderStatusLogs';

export type Address = {
	street: string;
	zipCode: string;
	city: string;
};

export const ordersTable = sqliteTable(
	'orders',
	{
		id: text('id').notNull().primaryKey(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
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
		customerId: text('customer_id')
			.notNull()
			.references(() => usersTable.id),
		cartOwnerId: text('cart_owner_id')
			.notNull()
			.references(() => usersTable.id),
		driverId: text('driver_id').references(() => usersTable.id)
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

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
	customer: one(usersTable, {
		fields: [ordersTable.customerId],
		references: [usersTable.id],
		relationName: 'order_customer'
	}),
	cartOwner: one(usersTable, {
		fields: [ordersTable.cartOwnerId],
		references: [usersTable.id],
		relationName: 'order_cart_owner'
	}),
	driver: one(usersTable, {
		fields: [ordersTable.driverId],
		references: [usersTable.id],
		relationName: 'order_driver'
	}),
	// promoCode: one(promoCodes, {
	// 	fields: [ordersTable.promoCodeId],
	// 	references: [promoCodes.id]
	// }),
	products: many(orderProductsTable, { relationName: 'order_products' }),
	statusLogs: many(orderStatusLogsTable, { relationName: 'order_status_logs' }),
	address: one(orderAddressTable, {
		fields: [ordersTable.id],
		references: [orderAddressTable.orderId]
	})
}));

export const createOrderSchema = createInsertSchema(ordersTable);
export const selectOrderSchema = createSelectSchema(ordersTable);

export type SelectOrder = InferSelectModel<typeof ordersTable>;
export type InsertOrder = InferInsertModel<typeof ordersTable>;
