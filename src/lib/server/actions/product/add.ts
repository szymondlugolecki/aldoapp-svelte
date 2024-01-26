// import { p } from '$lib/server/clients/pClient';
import { error, type Action, fail } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import getCustomError from '$lib/client/constants/customErrors';
import { isAtLeastModerator } from '$lib/client/functions';
import { addProduct } from '$lib/server/functions/db';
import { productURLParser } from '$lib/server/functions/utils';
import { products$ } from '$lib/client/schemas';
import { setMessage, superValidate } from 'sveltekit-superforms/server';

const add: Action = async ({ request, locals }) => {
	// Must be a moderator or higher
	if (!locals.session) {
		error(...getCustomError('not-logged-in'));
	}

	if (!isAtLeastModerator(locals.session?.user.role)) {
		error(...getCustomError('insufficient-permissions'));
	}

	const form = await superValidate(request, products$.addForm);
	if (!form.valid) {
		return fail(400, { form });
	}

	const { name, symbol, category, subcategory, price, weight } = form.data;

	const encodedURL = productURLParser(name, symbol);

	// Add the product to the database
	const [, addProductError] = await trytm(
		addProduct({
			authorId: locals.session.user.id,
			name,
			symbol,
			// description: description || null,
			// images: imagesURL,
			category,
			subcategory: subcategory ?? '',
			price: price.toFixed(2),
			weight: weight.toFixed(2),
			producent: 'deheus',
			encodedURL,
			amountLeft: Math.floor(Math.random() * 5), // 0 - 5,
			createdAt: new Date()
		})
	);
	if (addProductError) {
		// Unexpected-error
		console.log('addProductError', addProductError);
		error(500, 'Wystąpił błąd podczas dodawania produktu');
	}

	return setMessage(form, 'Dodano produkt');
};

export default add;
