import { prisma } from '$lib/server/clients/prismaClient';
import { trytm } from '@bdsqqq/try';
import { json, error } from '@sveltejs/kit';

const sleep = (s: number) => new Promise((resolve) => setTimeout(resolve, s * 1000));

export async function GET({ url }) {
	const cart = url.searchParams.get('cart');

	console.log('cart', cart);

	if (!cart) {
		return json({ success: true, products: [] });
		// throw error(400, 'Pusty koszyk');
	}

	const productIds = cart.split(',');

	const [products, productsFetchError] = await trytm(
		prisma.product.findMany({
			where: {
				OR: productIds.map((id) => ({ id }))
			},
			select: {
				id: true,
				name: true,
				symbol: true,
				price: true,
				images: {
					select: {
						url: true
					}
				},
				amountLeft: true
			}
		})
	);

	if (productsFetchError) {
		console.log('productsFetchError', productsFetchError);
		throw error(400, 'Wystąpił błąd podczas pobierania produktów');
	}

	console.log(
		'products',
		products.map((product) => product.name)
	);

	const productFormat = products.map((product) => {
		return { ...product, images: product.images.map((img) => img.url) };
	});

	await sleep(15);

	return json({
		success: true,
		products: productFormat
	});
}
