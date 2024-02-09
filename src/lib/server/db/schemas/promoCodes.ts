// import { sql } from 'drizzle-orm';
import { discountTypes } from '../../../client/constants/dbTypes';
import { relations, sql, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { sqliteTable, text, integer, index, real } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { orders } from './orders';
// import { users } from './users';

export const promoCodes = sqliteTable(
	'promo_codes',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),

		// Promo Code info
		code: text('code', { length: 32 }).notNull(),
		discount: real('discount').notNull(), // { precision: 8, scale: 2 }
		validSince: integer('valid_since', { mode: 'timestamp' }).notNull(),
		validUntil: integer('valid_until', { mode: 'timestamp' }).notNull(),
		// usedCount: int('use_count').notNull(),
		totalUseLimit: integer('use_limit').notNull(),
		perUserLimit: integer('per_user_use_limit').notNull(),
		enabled: integer('enabled', { mode: 'boolean' }).default(true).notNull(), // we can manualy disable a promo code
		discountType: text('discount_type', { enum: discountTypes }).notNull(),
		minCartValue: real('min_cart_value').notNull(), // { precision: 8, scale: 2 }
		// applicableProducts: text('applicable_products', { mode: 'json' }).$type<ApplicableProducts>().notNull(),
		// add products list to which the promo code applies

		// relations
		authorId: text('author_id', { length: 36 })
			.notNull()
			.references(() => users.id)
	},
	(product) => ({
		// indexes
		authorId: index('promo_codes_author_idx').on(product.authorId)
	})
);

export const promoCodesRelations = relations(promoCodes, ({ one, many }) => ({
	author: one(users, {
		fields: [promoCodes.authorId],
		references: [users.id]
	}),
	orders: many(orders),
	uses: many(promoCodeUsages)
}));

export const promoCodeUsages = sqliteTable(
	'promo_code_uses',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),

		promoCodeId: text('promocode_used_id', { length: 36 }).notNull(),
		orderId: integer('order_id', { mode: 'number' })
			.notNull()
			.references(() => orders.id),
		userId: integer('user_id', { mode: 'number' })
			.notNull()
			.references(() => users.id)
	},
	(promoCodeUsage) => ({
		// indexes
		promoCodeId: index('promo_code_use_idx').on(promoCodeUsage.promoCodeId),
		userId: index('user_id_idx').on(promoCodeUsage.userId)
	})
);

export const promoCodesUsagesRelations = relations(promoCodeUsages, ({ one }) => ({
	order: one(orders, {
		fields: [promoCodeUsages.orderId],
		references: [orders.id]
	}),
	promoCode: one(promoCodes, {
		fields: [promoCodeUsages.promoCodeId],
		references: [promoCodes.id]
	}),
	user: one(users, {
		fields: [promoCodeUsages.userId],
		references: [users.id]
	})
}));

export type SelectPromoCode = InferSelectModel<typeof promoCodes>;
export type InsertPromoCode = InferInsertModel<typeof promoCodes>;

export type SelectPromoCodeUsage = InferSelectModel<typeof promoCodeUsages>;
export type InsertPromoCodeUsage = InferInsertModel<typeof promoCodeUsages>;
