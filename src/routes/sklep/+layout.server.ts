// import { p } from '$lib/server/clients/pClient';

import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schemas/products';

export const load = () => {
	// : { products: Promise<StoreProduct[]> }
	return {
		products: db
			.select({
				id: products.id,
				name: products.name,
				symbol: products.symbol,
				description: products.description,
				images: products.images,
				weight: products.weight,
				price: products.price,
				category: products.category,
				subcategory: products.subcategory,
				producent: products.producent,
				encodedURL: products.encodedURL
				// amountLeft: products.
			})
			.from(products)
			.limit(10)
		// p.product.findMany({
		// 	select: {
		// 		id: true,
		// 		name: true,
		// 		symbol: true,
		// 		description: true,
		// 		images: {
		// 			select: {
		// 				url: true
		// 			}
		// 		},
		// 		weight: true,
		// 		price: true,
		// 		category: true,
		// 		subcategory: true,
		// 		producent: true,
		// 		encodedURL: true,
		// 		amountLeft: true
		// 	},
		// 	skip: 0,
		// 	take: 10
		// })
		// lazy: {
		// 	products: p.product.findMany({
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
