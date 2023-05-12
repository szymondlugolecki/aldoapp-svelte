import type { PromoCode } from '$lib/server/db/schemas/promoCodes';
import type { User } from '$types';

export type PromoCodeWithUsages = PromoCode & {
	usages: string[];
	author: Pick<User, 'id' | 'fullName' | 'email'>;
};

export type PromoCodeRowType =
	| Extract<keyof PromoCode, 'code' | 'discount' | 'createdAt'>
	| 'usages'
	| 'action'
	| 'extraInfo'
	| 'validDateRange';
