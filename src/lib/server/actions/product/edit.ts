// import { p } from '$lib/server/clients/pClient';
import { error, type Action, fail } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import getCustomError from '$lib/client/constants/customErrors';
import { isAtLeastModerator } from '$lib/client/functions';
import { products$ } from '$lib/client/schemas';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';
import { productsTable, type SelectProduct } from '$lib/server/db/schemas/products';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { put } from '@vercel/blob';
import { env } from '$env/dynamic/private';

const edit: Action = async ({ request, locals }) => {
	const sessionUser = locals.user;
	// Must be a moderator or higher
	if (!sessionUser) {
		redirect(303, '/zaloguj');
		// error(...getCustomError('not-logged-in'));;
	}

	if (!isAtLeastModerator(sessionUser.role)) {
		error(...getCustomError('insufficient-permissions'));
	}

	const formData = await request.formData();
	const form = await superValidate(formData, products$.editForm);

	if (!form.valid) return fail(400, { form });

	// Make sure something else other than id was provided
	if (Object.keys(form.data).length <= 1) {
		return setError(form, 'Nie podano żadnych danych do edycji', { status: 400 });
	}

	const { id, name, symbol, category, subcategory, price, producent, weight, description, hidden } =
		form.data;

	let imageUrl: string | null = null;

	const image = formData.get('images');
	console.log('formData.image', image);

	if (image instanceof File) {
		// One image per product is enough for now
		const fileBuffer = await image.arrayBuffer();
		const { url } = await put(image.name, fileBuffer, {
			token: env.BLOB_READ_WRITE_TOKEN,
			access: 'public'
		});

		console.log('url', url);
		imageUrl = url;
	}

	const newProduct: Partial<
		Pick<
			SelectProduct,
			| 'name'
			| 'symbol'
			| 'category'
			| 'subcategory'
			| 'price'
			| 'producent'
			| 'weight'
			| 'description'
			| 'image'
			| 'hidden'
		>
	> = {};

	if (name) {
		newProduct.name = name;
	}

	if (symbol) {
		newProduct.symbol = symbol;
	}

	if (category) {
		newProduct.category = category;
	}

	if (subcategory) {
		newProduct.subcategory = subcategory;
	}

	if (price) {
		newProduct.price = price;
	}

	if (producent) {
		newProduct.producent = producent;
	}

	if (weight) {
		newProduct.weight = weight;
	}

	if (description) {
		newProduct.description = description;
	}

	if (imageUrl) {
		newProduct.image = imageUrl;
	}

	if (hidden) {
		newProduct.hidden = hidden;
	}

	console.log('newProduct', newProduct);

	// Edit the product in the db
	const [, editProductError] = await trytm(
		db
			.update(productsTable)
			.set({
				...newProduct
			})
			.where(eq(productsTable.id, id))
	);

	if (editProductError) {
		// Unexpected-error
		console.error('editProductError', editProductError);
		return setError(form, 'Błąd serwera podczas edytowania użytkownika', { status: 500 });
	}

	return setMessage(form, 'Edytowano produkt');
};

export default edit;
