// db.ts
// import { sql } from 'drizzle-orm';
import type { InferModel } from 'drizzle-orm';
import {
	mysqlTable,
	serial,
	uniqueIndex,
	varchar,
	boolean,
	timestamp,
	text,
	int,
	double,
	char
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
		// updatedAt: timestamp('updated_at').onUpdateNow(),

		// Promo Code info
		code: varchar('code', { length: 32 }).notNull(),
		discount: double('discount').notNull(),
		validSince: timestamp('valid_since').notNull(),
		validUntil: timestamp('valid_until').notNull(),
		// usedCount: int('use_count').notNull(),
		useLimit: int('use_limit').notNull(),
		onePerUser: boolean('one_per_user').notNull(),
		disabled: boolean('disabled').default(false).notNull(),
		discountType: text('discount_type', { enum: ['percent', 'fixed'] }).notNull(),

		// relations
		userId: varchar('user_id', { length: 36 }).notNull(),
		// .references(() => users.id),
		encodedURL: varchar('encoded_url', { length: 255 }).notNull()
	},
	(product) => ({
		// indexes
		userId: uniqueIndex('user_idx').on(product.userId)
	})
);

export const promoCodeUsages = mysqlTable(
	'promo_code_usages',
	{
		id: serial('id').primaryKey().autoincrement(),
		createdAt: timestamp('created_at')
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),

		// Promocode and user IDs
		promoCodeId: varchar('promocode_id', { length: 36 }).notNull(),
		// .references(() => promoCodes.id),
		userId: char('user_id', { length: 255 }).notNull()
		// .references(() => users.id)
	},
	(promoCodeUsage) => ({
		// indexes
		promoCodeId: uniqueIndex('promo_code_id_idx').on(promoCodeUsage.promoCodeId),
		userId: uniqueIndex('user_id_idx').on(promoCodeUsage.userId)
	})
);

export type PromoCode = InferModel<typeof promoCodes>;
export type PromoCodeUsage = InferModel<typeof promoCodeUsages>;
