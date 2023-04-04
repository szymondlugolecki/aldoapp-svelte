import { db } from '$lib/server/db';
import { promoCodeUsages, promoCodes } from '$lib/server/db/schemas/promoCodes';
import { desc, eq } from 'drizzle-orm/expressions';

export const load = async () => {
	return {
		promoCodes: db
			.select({
				promoCode: promoCodes,
				usage: {
					userId: promoCodeUsages.userId
				}
			})
			.from(promoCodes)
			.orderBy(desc(promoCodes.createdAt))
			.leftJoin(promoCodeUsages, eq(promoCodes.id, promoCodeUsages.promoCodeId))
			.limit(3),
		promise: {
			promoCodes: db
				.select({
					promoCode: promoCodes,
					usage: {
						userId: promoCodeUsages.userId
					}
				})
				.from(promoCodes)
				.leftJoin(promoCodeUsages, eq(promoCodes.id, promoCodeUsages.promoCodeId))
				.orderBy(desc(promoCodes.createdAt))
				.offset(3)
				.limit(999_999)
		}
	};
};
