import { db } from '$lib/server/db';
import { trytm } from '@bdsqqq/try';
import { error } from '@sveltejs/kit';

import changeProductQuantity from '$lib/server/actions/cart/changeProductQuantity';
import { superValidate } from 'sveltekit-superforms/server';
import { cart$ } from '$lib/client/schemas';

export const actions = {
	changeProductQuantity
};

export const load = async ({ params }) => {
	const addProductForm = await superValidate(cart$.changeProductQuantity);

	const encodedURL = encodeURIComponent(params.productURL);
	const [product, findProductError] = await trytm(
		db.query.productsTable.findFirst({
			columns: {
				id: true,
				name: true,
				symbol: true,
				description: true,
				weight: true,
				price: true,
				category: true,
				subcategory: true,
				producent: true,
				encodedURL: true,
				amountLeft: true,
				image: true
			},
			where: (product, { eq }) => eq(product.encodedURL, encodedURL)
		})
	);

	if (findProductError) {
		// Unexpected-error
		console.log('findProductError', findProductError);
		error(500, 'Wystąpił błąd');
	}

	if (!product) {
		error(404, 'Nie znaleziono produktu');
	}

	return {
		product,
		addProductForm
	};
};
