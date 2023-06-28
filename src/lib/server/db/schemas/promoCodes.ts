// import { sql } from 'drizzle-orm';
import { discountTypes, type ApplicableProducts } from '../../../client/constants/dbTypes';
import { relations, type InferModel } from 'drizzle-orm';
import {
	mysqlTable,
	serial,
	varchar,
	boolean,
	timestamp,
	text,
	int,
	char,
	index,
	decimal,
	json
} from 'drizzle-orm/mysql-core';
import { users } from './users';
import { orders } from './orders';
// import { users } from './users';

export const promoCodes = mysqlTable(
	'promo_codes',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').onUpdateNow(),

		// Promo Code info
		code: varchar('code', { length: 32 }).notNull(),
		discount: decimal('discount', { precision: 8, scale: 2 }).notNull(),
		validSince: timestamp('valid_since').notNull(),
		validUntil: timestamp('valid_until').notNull(),
		// usedCount: int('use_count').notNull(),
		totalUseLimit: int('use_limit').notNull(),
		perUserLimit: int('per_user_use_limit').notNull(),
		enabled: boolean('disabled').default(true).notNull(), // we can manualy disable a promo code
		discountType: text('discount_type', { enum: discountTypes }).notNull(),
		minCartValue: decimal('min_cart_value', { precision: 8, scale: 2 }).notNull(),
		applicableProducts: json('applicable_products').$type<ApplicableProducts>().notNull(),
		// add products list to which the promo code applies

		// relations
		authorId: varchar('author_id', { length: 36 }).notNull()
	},
	(product) => ({
		// indexes
		authorId: index('author_idx').on(product.authorId)
	})
);

export const promoCodesRelations = relations(promoCodes, ({ one, many }) => ({
	author: one(users, {
		fields: [promoCodes.authorId],
		references: [users.id]
	}),
	orders: many(orders),
	uses: many(promoCodeUses)
}));

export const promoCodeUses = mysqlTable(
	'promo_code_uses',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),

		promoCodeId: varchar('promocode_used_id', { length: 36 }).notNull(),
		orderId: varchar('order_id', { length: 36 }).notNull(),
		userId: char('user_id', { length: 255 }).notNull()
	},
	(promoCodeUsage) => ({
		// indexes
		promoCodeId: index('promo_code_use_idx').on(promoCodeUsage.promoCodeId),
		userId: index('user_id_idx').on(promoCodeUsage.userId)
	})
);

export const promoCodesUsesRelations = relations(promoCodeUses, ({ one }) => ({
	order: one(orders, {
		fields: [promoCodeUses.orderId],
		references: [orders.id]
	}),
	promoCode: one(promoCodes, {
		fields: [promoCodeUses.promoCodeId],
		references: [promoCodes.id]
	}),
	user: one(users, {
		fields: [promoCodeUses.userId],
		references: [users.id]
	})
}));

export type PromoCode = InferModel<typeof promoCodes>;
export type PromoCodeUse = InferModel<typeof promoCodeUses>;
