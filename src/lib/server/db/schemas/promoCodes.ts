// import { sql } from 'drizzle-orm';
import { discountTypes } from '../../../client/constants/dbTypes';
import { relations, sql, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { sqliteTable, text, integer, index, real } from 'drizzle-orm/sqlite-core';
import { usersTable } from './users';
import { ordersTable } from './orders';
// import { users } from './users';

export const promoCodesTable = sqliteTable(
	'promo_codes',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),

		// Promo Code info
		code: text('code', { length: 32 }).notNull(),
		discount: real('discount').notNull(), // { precision: 8, scale: 2 }
		validSince: integer('valid_since', { mode: 'timestamp_ms' }).notNull(),
		validUntil: integer('valid_until', { mode: 'timestamp_ms' }).notNull(),
		// usedCount: int('use_count').notNull(),
		totalUseLimit: integer('use_limit').notNull(),
		perUserLimit: integer('per_user_use_limit').notNull(),
		enabled: integer('enabled', { mode: 'boolean' }).default(true).notNull(), // we can manualy disable a promo code
		discountType: text('discount_type', { enum: discountTypes }).notNull(),
		minCartValue: real('min_cart_value').notNull(), // { precision: 8, scale: 2 }
		// applicableProducts: text('applicable_products', { mode: 'json' }).$type<ApplicableProducts>().notNull(),
		// add products list to which the promo code applies

		// relations
		authorId: text('author_id')
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' })
	},
	(product) => ({
		// indexes
		authorId: index('promo_codes_author_idx').on(product.authorId)
	})
);

export const promoCodesRelations = relations(promoCodesTable, ({ one, many }) => ({
	author: one(usersTable, {
		fields: [promoCodesTable.authorId],
		references: [usersTable.id]
	}),
	// orders: many(ordersTable),
	uses: many(promoCodeUsagesTable)
}));

export const promoCodeUsagesTable = sqliteTable(
	'promo_code_uses',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),

		promoCodeId: integer('promocode_used_id', { mode: 'number' })
			.notNull()
			.references(() => promoCodesTable.id),
		orderId: text('order_id')
			.notNull()
			.references(() => ordersTable.id),
		userId: text('user_id')
			.notNull()
			.references(() => usersTable.id)
	},
	(promoCodeUsage) => ({
		// indexes
		promoCodeId: index('promo_code_uses_idx').on(promoCodeUsage.promoCodeId),
		userId: index('user_id_idx').on(promoCodeUsage.userId)
	})
);

export const promoCodesUsagesRelations = relations(promoCodeUsagesTable, ({ one }) => ({
	order: one(ordersTable, {
		fields: [promoCodeUsagesTable.orderId],
		references: [ordersTable.id]
	}),
	promoCode: one(promoCodesTable, {
		fields: [promoCodeUsagesTable.promoCodeId],
		references: [promoCodesTable.id]
	}),
	user: one(usersTable, {
		fields: [promoCodeUsagesTable.userId],
		references: [usersTable.id]
	})
}));

export type SelectPromoCode = InferSelectModel<typeof promoCodesTable>;
export type InsertPromoCode = InferInsertModel<typeof promoCodesTable>;

export type SelectPromoCodeUsage = InferSelectModel<typeof promoCodeUsagesTable>;
export type InsertPromoCodeUsage = InferInsertModel<typeof promoCodeUsagesTable>;
