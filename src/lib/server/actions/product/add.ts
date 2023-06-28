import { addProductSchema } from '$lib/client/schemas/products';
// import { p } from '$lib/server/clients/pClient';
import { error, fail, type Action } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { errorResponses } from '$lib/client/constants/errorResponses';
import { isAtLeastModerator, productURLParser } from '$lib/client/functions';
import { addProduct } from '$lib/server/functions/db';

const add: Action = async ({ request, locals }) => {
	// Only moderators and admins are allowed to add a product
	if (!locals.session) {
		throw error(...errorResponses[401]);
	}

	if (!isAtLeastModerator(locals.session?.user.role)) {
		throw error(...errorResponses[403]);
	}

	// Validate the user input
	const [formData, formDataError] = await trytm(request.formData());
	if (formDataError) {
		return fail(400, {
			errors: ['Niepoprawne dane']
		});
	}

	// Need to extract the images from the formData before using Object.fromEntries
	// Because then images overwrite each other
	// const imageArray = formData.getAll('images');

	const entries = Object.fromEntries(formData);

	const data = {
		...entries,
		...(entries.weight && typeof entries.weight === 'string'
			? { weight: Number(entries.weight.replace(',', '.')) }
			: {}),
		...(entries.price && typeof entries.price === 'string'
			? { price: Number(entries.price.replace(',', '.')) }
			: {})
	};

	if (!data.price || isNaN(data.price)) {
		return fail(400, {
			errors: ['Nieprawidłowa cena']
		});
	}
	if (!data.weight || isNaN(data.weight)) {
		return fail(400, {
			errors: ['Nieprawidłowa waga']
		});
	}

	console.log('data', data);

	const [addProductObj, addProductParseError] = betterZodParse(addProductSchema, data);
	if (addProductParseError) {
		return fail(400, {
			errors: addProductParseError
		});
	}
	const { name, symbol, category, subcategory, price, weight, producent } = addProductObj;

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
			producent,
			encodedURL,
			amountLeft: Math.floor(Math.random() * 5) // 0 - 5
		})
	);
	if (addProductError) {
		// Unexpected-error
		console.log('addProductError', addProductError);
		return fail(500, {
			errors: ['Wystąpił błąd. Produkt był poprawny, ale nie udało się go dodać do bazy danych']
		});
	}

	return { success: true, message: 'Pomyślnie dodano produkt' };
};

export default add;
