// db.ts
// import { sql } from 'drizzle-orm';
import type { InferModel } from 'drizzle-orm';
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
	decimal
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm/sql';
// import { users } from './users';

export const promoCodes = mysqlTable(
	'promo_codes',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at')
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),

		// Promo Code info
		code: varchar('code', { length: 32 }).notNull(),
		discount: decimal('discount', { precision: 8, scale: 2 }).notNull(),
		validSince: timestamp('valid_since').notNull(),
		validUntil: timestamp('valid_until').notNull(),
		// usedCount: int('use_count').notNull(),
		useLimit: int('use_limit').notNull(),
		onePerUser: boolean('one_per_user').notNull(),
		disabled: boolean('disabled').default(false).notNull(),
		discountType: text('discount_type', { enum: ['percentage', 'fixed'] }).notNull(),
		// add products list to which the promo code applies

		// relations
		authorId: varchar('author_id', { length: 36 }).notNull(),
		encodedURL: varchar('encoded_url', { length: 255 }).notNull()
	},
	(product) => ({
		// indexes
		authorId: index('author_idx').on(product.authorId)
	})
);

export const promoCodeUsages = mysqlTable(
	'promo_code_usages',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at')
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),

		promoCodeId: varchar('promocode_id', { length: 36 }).notNull(),
		userId: char('user_id', { length: 255 }).notNull()
	},
	(promoCodeUsage) => ({
		// indexes
		promoCodeId: index('promo_code_id_idx').on(promoCodeUsage.promoCodeId),
		userId: index('user_id_idx').on(promoCodeUsage.userId)
	})
);

export type PromoCode = InferModel<typeof promoCodes>;
export type PromoCodeUsage = InferModel<typeof promoCodeUsages>;
