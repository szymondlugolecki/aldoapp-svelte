// import { p } from '$lib/server/clients/pClient';
import { error, type Action, fail, redirect } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import getCustomError from '$lib/client/constants/customErrors';
import { isAtLeastModerator } from '$lib/client/functions';
import { createProduct } from '$lib/server/functions/db';
import { productURLParser } from '$lib/server/functions/utils';
import { products$ } from '$lib/client/schemas';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';

const add: Action = async ({ request, locals }) => {
	const sessionUser = locals.user;
	// Must be a moderator or higher
	if (!sessionUser) {
		redirect(303, '/zaloguj');
		// error(...getCustomError('not-logged-in'));;
	}

	if (!isAtLeastModerator(sessionUser.role)) {
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
		createProduct({
			authorId: sessionUser.id,
			name,
			symbol,
			// description: description || null,
			// images: imagesURL,
			category,
			subcategory: subcategory ?? null,
			price: price,
			weight: weight,
			producent: 'deheus',
			encodedURL,
			amountLeft: Math.floor(Math.random() * 5), // 0 - 5,
			createdAt: new Date()
		})
	);
	if (addProductError) {
		// Unexpected-error
		console.log('addProductError', addProductError);
		return setError(form, 'Błąd serwera podczas dodawania produktu', { status: 500 });
	}

	return setMessage(form, 'Dodano produkt');
};

export default add;
