import { prisma } from '$lib/server/clients/prismaClient';

import add from '$lib/server/actions/product/add';
import edit from '$lib/server/actions/product/edit';
import remove from '$lib/server/actions/product/remove';

export const load = async () => {
	return {
		products: prisma.product.findMany({
			include: {
				author: {
					select: {
						id: true,
						fullName: true,
						email: true,
						role: true
					}
				},
				images: {
					select: {
						url: true
					}
				}
			}
		})
	};
};

export const actions = {
	add,
	edit,
	remove
};
