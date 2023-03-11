import { prisma } from '$lib/server/clients/prismaClient';

export const load = () => {
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
};
