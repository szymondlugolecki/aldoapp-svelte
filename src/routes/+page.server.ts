import { redis } from '$lib/server/clients/redis.js';
import { db } from '$lib/server/db';
import type { Product } from '$lib/server/db/schemas/products';
import { trytm } from '@bdsqqq/try';
import { inArray } from 'drizzle-orm';

const MINUTE_IN_SECONDS = 60;
const HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS;

type ProductShowcaseReady = Pick<Product, 'id' | 'name' | 'price' | 'encodedURL'>;

const cacheNames = {
	recentlyOrdered: 'recently-ordered',
	mostBought: 'most-bought'
};

const fetchMostBoughtFromDb = async () => {
	// Fetch all ordered products
	const [allOrderedProducts, allOrderedProductsError] = await trytm(
		db.query.orderProducts.findMany({
			columns: {
				productId: true,
				quantity: true
			}
		})
	);

	if (allOrderedProductsError) {
		console.error('allOrderedProductsError', allOrderedProductsError);
		return [];
	}
	if (!allOrderedProducts.length) {
		return [];
	}

	// Grouped but unsorted
	const groupedProducts = allOrderedProducts.reduce(
		(acc, { productId: id, quantity }) => {
			if (acc[id]) {
				acc[id] += quantity;
			} else {
				acc[id] = quantity;
			}

			return acc;
		},
		{} as {
			[id: number]: number;
		}
	);

	// All products sorted
	const productsSorted = Object.entries(groupedProducts).sort((a, b) => b[1] - a[1]);
	const tenMostBoughtProducts = productsSorted.map(([id]) => Number(id)).slice(0, 10);

	const [products, mostBoughtProductsError] = await trytm(
		db.query.products.findMany({
			where: (products) => inArray(products.id, tenMostBoughtProducts),
			columns: {
				id: true,
				name: true,
				price: true,
				encodedURL: true
			},
			limit: 10
		})
	);

	if (mostBoughtProductsError) {
		console.error('mostBoughtProductsError', mostBoughtProductsError);
		return [];
	}
	if (!products.length) {
		return [];
	}

	// Should live ~20 hours
	await redis.set(cacheNames.mostBought, products, { ex: 20 * HOUR_IN_SECONDS });

	return products;
};

const fetchRecentlyOrderedFromDb = async () => {
	const [recentlyOrderedProducts, recentlyOrderedProductsError] = await trytm(
		db.query.orders.findMany({
			columns: {
				// createdAt: true,
			},
			with: {
				products: {
					columns: {},
					with: {
						product: {
							columns: {
								id: true,
								name: true,
								price: true,
								encodedURL: true
							}
						}
					}
				}
			},
			limit: 10,
			orderBy: (orders, { desc }) => [desc(orders.createdAt)]
		})
	);

	if (recentlyOrderedProductsError) {
		console.error('recentlyOrderedProductsError', recentlyOrderedProductsError);
		return [];
	}
	if (!recentlyOrderedProducts.length) {
		return [];
	}

	const products = recentlyOrderedProducts.flatMap(({ products }) =>
		products.map(({ product }) => product)
	);

	// Cache the results for next 5 hours
	// Should live ~5 hours
	await redis.set(cacheNames.recentlyOrdered, products, { ex: 5 * HOUR_IN_SECONDS });

	return products;
};

const getRecentlyOrdered = async () => {
	const recentlyOrderedCache = await redis.get<ProductShowcaseReady[]>(cacheNames.recentlyOrdered);
	if (recentlyOrderedCache) {
		return recentlyOrderedCache;
	} else {
		return await fetchRecentlyOrderedFromDb();
	}
};

const fetchMostBought = async () => {
	const mostBoughtCache = await redis.get<ProductShowcaseReady[]>(cacheNames.mostBought);
	if (mostBoughtCache) {
		return mostBoughtCache;
	} else {
		return await fetchMostBoughtFromDb();
	}
};

const fetchFavoriteProductsFromDb = async () => {
	// Replace products table with favorite products table once its created
	const [favoriteProducts, favoriteProductsError] = await trytm(
		db.query.products.findMany({
			columns: {
				id: true,
				name: true,
				price: true,
				encodedURL: true
			},
			limit: 10
		})
	);

	if (favoriteProductsError) {
		console.error('favoriteProductsError', favoriteProductsError);
		return [];
	}

	if (!favoriteProducts.length) {
		return [];
	}

	return favoriteProducts;
};

export const load = async () => {
	// Hit the redis cache to see if we have these
	// @ Most bought
	// @ Recently ordered
	// @ Favorite products - No need to cache this

	// Fetching from cache/db
	const [recentlyOrdered, mostBought, favoriteProducts] = await Promise.all([
		getRecentlyOrdered(),
		fetchMostBought(),
		fetchFavoriteProductsFromDb()
	]);

	// const subs = await db.query.subscriptions.findMany({
	// 	columns: {
	// 		endpoint: true,
	// 		keys: true,
	// 		expirationTime: true,
	// 		userId: true,
	// 		userAgent: true
	// 	}
	// });

	// console.log('subscriptions', subs);

	// const verificationTokens = await db.query.verificationTokens.findMany({
	// 	columns: {
	// 		userId: true,
	// 		code: true,
	// 		userAgent: true
	// 	}
	// });

	// console.log('verificationTokens', verificationTokens.length, verificationTokens);

	return {
		recentlyOrdered,
		mostBought,
		favoriteProducts
	};
};
