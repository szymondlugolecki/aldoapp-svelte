import { prisma } from '$lib/server/clients/prismaClient';
// import type { StoreProduct } from '$types';

export const load = () =>
	// : { products: Promise<StoreProduct[]>;}
	{
		return {
			products: prisma.product.findMany({
				select: {
					id: true,
					name: true,
					symbol: true,
					description: true,
					images: true,
					weight: true,
					price: true,
					category: true,
					subcategory: true,
					producent: true
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
