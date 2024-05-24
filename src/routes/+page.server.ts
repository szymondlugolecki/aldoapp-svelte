import { redis } from '$lib/server/clients/redis.js';
import { db } from '$lib/server/db';
import type { SelectProduct } from '$lib/server/db/schemas/products';
import { trytm } from '@bdsqqq/try';
import { inArray } from 'drizzle-orm';

const MINUTE_IN_SECONDS = 60;
const HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS;

export type ProductShowcaseReady = Pick<
	SelectProduct,
	'id' | 'name' | 'price' | 'encodedURL' | 'image'
>;

const cacheNames = {
	recentlyOrdered: 'recently-ordered',
	mostBought: 'most-bought'
};

const fetchMostBoughtFromDb = async () => {
	// Fetch all ordered products
	const [allOrderedProducts, allOrderedProductsError] = await trytm(
		db.query.orderProductsTable.findMany({
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

	const [mostBoughtProducts, mostBoughtProductsError] = await trytm(
		db.query.productsTable.findMany({
			where: (products) => inArray(products.id, tenMostBoughtProducts),
			columns: {
				id: true,
				name: true,
				price: true,
				encodedURL: true,
				image: true,
				hidden: true
			},
			limit: 8
		})
	);

	if (mostBoughtProductsError) {
		console.error('mostBoughtProductsError', mostBoughtProductsError);
		return [];
	}
	if (!mostBoughtProducts.length) {
		return [];
	}

	const products = mostBoughtProducts.filter((product) => !product.hidden);

	// Should live ~3 hours
	await redis.set(cacheNames.mostBought, products, { ex: 3 * HOUR_IN_SECONDS });

	return products;
};

const fetchRecentlyOrderedFromDb = async () => {
	const [recentlyOrderedProducts, recentlyOrderedProductsError] = await trytm(
		db.query.ordersTable.findMany({
			columns: {},
			with: {
				products: {
					columns: {},
					with: {
						product: {
							columns: {
								id: true,
								name: true,
								price: true,
								encodedURL: true,
								image: true,
								hidden: true
							}
						}
					}
				}
			},
			limit: 8,
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

	const products = recentlyOrderedProducts
		.flatMap(({ products }) => products.map(({ product }) => product))
		.filter((product) => !product.hidden);

	// Cache the results for next 30 minutes
	// Should live 30 minutes
	await redis.set(cacheNames.recentlyOrdered, products, { ex: 0.5 * HOUR_IN_SECONDS });

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

// const fetchFavoriteProductsFromDb = async () => {
// 	// Replace products table with favorite products table once its created
// 	const [favoriteProducts, favoriteProductsError] = await trytm(
// 		db.query.productsTable.findMany({
// 			columns: {
// 				id: true,
// 				name: true,
// 				price: true,
// 				encodedURL: true,
// 				image: true
// 			},
// 			limit: 10
// 		})
// 	);

// 	if (favoriteProductsError) {
// 		console.error('favoriteProductsError', favoriteProductsError);
// 		return [];
// 	}

// 	if (!favoriteProducts.length) {
// 		return [];
// 	}

// 	return favoriteProducts;
// };

// import wasmModuleInit from '$lib/assets/codecs/webp_dec_codec.wasm?init';
// import wasmModuleURL from '$lib/assets/codecs/webp_enc_codec.wasm?url';
// import wasmPath from '@jsquash/jpeg/codec/dec/jpeg_dec.wasm?module';
// import decodeJpeg, { init } from '@jsquash/jpeg/decode';

// console.log('wasmModuleURL', typeof wasmModuleURL, wasmModuleURL);
// console.log('wasmPath', typeof wasmPath, wasmPath);

// console.log(Object.keys(wasmPath));

// import JPEG_DEC_WASM from '@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm?module';

export const load = async ({ fetch }) => {
	// Hit the redis cache to see if we have these
	// @ Most bought
	// @ Recently ordered
	// @ Favorite products - No need to cache this

	// const response = await fetch(JPEG_DEC_WASM);
	// const wasmArrayBuffer = await response.arrayBuffer();
	// const wasmModule = new WebAssembly.Module(wasmArrayBuffer);

	// await init(wasmModule);

	// const image = await fetch('/pasze/0718.jpg')
	// 	.then((res) => res.arrayBuffer())
	// 	.then(decodeJpeg);

	// console.log('image', image);

	// const instance = await wasmModuleInit();
	// console.log('instance');

	// const wasmFileBuffer = await wasmFile.arrayBuffer();
	// const wasmModule = new WebAssembly.Module(wasmFileBuffer);

	// const { module, instance } = await WebAssembly.instantiateStreaming(
	// 	fetch(wasmPath),

	// );
	// console.log('instance', instance);
	// console.log('module', module);
	// const name = '1780-W25';
	// const extension = 'jpg';
	// const type = `image/${extension}`;

	// // Fetch the image
	// const response = await fetch(`/pasze/${name}.${extension}`);
	// if (!response.ok) {
	// 	console.error('No image found');
	// }

	// console.log('type', type);

	// const image = new File([await response.arrayBuffer()], name);

	// const { instance, module } = await WebAssembly.instantiateStreaming(wasmModule);

	// console.log('module exist?', module, Object.keys(module));
	// console.log('instance exist?', instance, Object.keys(instance));

	// const decodedImg = await module.decode(image);

	// console.log('decodedImg', decodedImg.length);

	// Fetching from cache/db
	const [recentlyOrdered, mostBought] = await Promise.all([
		getRecentlyOrdered(),
		fetchMostBought()
		// fetchFavoriteProductsFromDb()
	]);

	return {
		recentlyOrdered,
		mostBought
	};
};
