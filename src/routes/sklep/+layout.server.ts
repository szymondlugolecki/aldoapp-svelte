import { prisma } from '$lib/server/clients/prismaClient';

export const load = () => {
	// : { products: Promise<StoreProduct[]> }
	return {
		products: prisma.product.findMany({
			select: {
				id: true,
				name: true,
				symbol: true,
				description: true,
				images: {
					select: {
						url: true
					}
				},
				weight: true,
				price: true,
				category: true,
				subcategory: true,
				producent: true,
				encodedURL: true,
				amountLeft: true
			},
			skip: 0,
			take: 10
		})
		// lazy: {
		// 	products: prisma.product.findMany({
		// 		select: {
		// 			id: true,
		// 			name: true,
		// 			symbol: true,
		// 			description: true,
		// 			images: true
		// 		},
		// 		skip: 10
		// 	})
		// }
	};
};
