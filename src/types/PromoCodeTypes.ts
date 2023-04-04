import type { PromoCode } from '$lib/server/db/schemas/promoCodes';

export type PromoCodeWithUsages = PromoCode & {
	usages: string[];
};

export type PromoCodeRowType =
	| Extract<keyof PromoCode, 'code' | 'discount' | 'validSince' | 'validUntil' | 'createdAt'>
	| 'usages'
	| 'action'
	| 'extraInfo';
