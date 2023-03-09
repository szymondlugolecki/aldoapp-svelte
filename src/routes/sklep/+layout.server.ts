import { prisma } from '$prisma';
import type { LayoutServerLoad } from './$types';

export const load = (() => {
	return {
		products: prisma.product.findMany({
			select: {
				id: true,
				name: true,
				symbol: true,
				thumbnail: true,
				description: true,
				images: true
			},
			skip: 0,
			take: 10
		}),
		lazy: {
			products: prisma.product.findMany({
				select: {
					id: true,
					name: true,
					symbol: true,
					thumbnail: true,
					description: true,
					images: true
				},
				skip: 10
			})
		}
	};
}) satisfies LayoutServerLoad;
