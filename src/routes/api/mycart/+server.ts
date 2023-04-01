// import { p } from '$lib/server/clients/pClient';
import { db } from '$lib/server/db';
import { products as productsTable } from '$lib/server/db/schemas/products';
import { sleep } from '$lib/server/functions/utils';
import { trytm } from '@bdsqqq/try';
import { json, error } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm/expressions';

export async function GET({ url }) {
	// Get the products' ids from the query string
	const cart = url.searchParams.get('cart');
	console.log('cart', cart);
	if (!cart) {
		return json({ success: true, products: [] });
	}

	// Parse the products' ids
	const productIds = cart.split(',').map((id) => Number(id));
	if (productIds.some((id) => isNaN(id))) {
		throw error(400, 'Niespodziewany błąd. Nieprawidłowe id produktu w koszyku');
	}

	// Fetch the products from the database
	const [products, productsFetchError] = await trytm(
		db
			.select({
				id: productsTable.id,
				name: productsTable.name,
				symbol: productsTable.symbol,
				price: productsTable.price,
				images: productsTable.images,
				amountLeft: productsTable.amountLeft,
				encodedURL: productsTable.encodedURL
			})
			.from(productsTable)
			.where(or(...productIds.map((id) => eq(productsTable.id, id))))
	);

	// Handle weird exceptions
	if (productsFetchError) {
		console.log('productsFetchError 1', productsFetchError);
		throw error(400, 'Wystąpił błąd podczas pobierania produktów');
	}
	if (!products.length) {
		console.log('productsFetchError');
		throw error(400, 'Wystąpił błąd. Nie znaleziono podanych produktów w bazie danych');
	}

	console.log(
		'cart products',
		products.map((product) => product.name)
	);

	// const productFormat = products.map((product) => {
	// 	return { ...product };
	// });

	await sleep(3);

	return json({
		success: true,
		products
	});
}

// p.product.findMany({
// 	where: {
// 		OR: productIds.map((id) => ({ id }))
// 	},
// 	select: {
// 		id: true,
// 		name: true,
// 		symbol: true,
// 		price: true,
// 		images: {
// 			select: {
// 				url: true
// 			}
// 		},
// 		amountLeft: true,
// 		encodedURL: true
// 	}
// })
