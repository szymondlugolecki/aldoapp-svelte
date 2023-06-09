import { db } from '$lib/server/db';
import add from '$lib/server/actions/promoCodes/add';
import { promoCodeUses, promoCodes } from '$lib/server/db/schemas/promoCodes';
import { desc, eq } from 'drizzle-orm';
import { users } from '$lib/server/db/schemas/users';

export const load = async () => {
	return {
		promoCodes: db
			.select({
				promoCode: promoCodes,
				usage: {
					userId: promoCodeUses.userId
				},
				author: {
					id: users.id,
					fullName: users.fullName,
					email: users.email
				}
			})
			.from(promoCodes)
			.leftJoin(promoCodeUses, eq(promoCodes.id, promoCodeUses.promoCodeId))
			.leftJoin(users, eq(promoCodes.authorId, users.id))
			.orderBy(desc(promoCodes.createdAt))
			.limit(3),
		promise: {
			promoCodes: db
				.select({
					promoCode: promoCodes,
					usage: {
						userId: promoCodeUses.userId
					},
					author: {
						id: users.id,
						fullName: users.fullName,
						email: users.email
					}
				})
				.from(promoCodes)
				.leftJoin(promoCodeUses, eq(promoCodes.id, promoCodeUses.promoCodeId))
				.leftJoin(users, eq(promoCodes.authorId, users.id))
				.orderBy(desc(promoCodes.createdAt))
				.offset(3)
				.limit(999_999)
		}
	};
};

export const actions = {
	add
};
