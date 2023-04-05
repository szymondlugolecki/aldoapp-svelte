// import { db } from '$lib/server/db';
// import { products } from '$lib/server/db/schemas/products';

export const load = ({ params }) => {
	console.log('params', params);
	return {
		// product: db
		// 	.select({
		// 		id: products.id,
		// 		name: products.name,
		// 		symbol: products.symbol,
		// 		description: products.description,
		// 		images: products.images,
		// 		weight: products.weight,
		// 		price: products.price,
		// 		category: products.category,
		// 		subcategory: products.subcategory,
		// 		producent: products.producent,
		// 		encodedURL: products.encodedURL,
		// 		amountLeft: products.amountLeft
		// 	})
		// 	.from(products)
		// 	.limit(1)
	};
};
