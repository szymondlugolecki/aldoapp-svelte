// import { p } from '$lib/server/clients/pClient';
import { error, type Action, fail } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import getCustomError from '$lib/client/constants/customErrors';
import { isAtLeastModerator } from '$lib/client/functions';
import { products$ } from '$lib/client/schemas';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';
import { products, type Product } from '$lib/server/db/schemas/products';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { utapi } from '$lib/server/clients/uploadthing';

const edit: Action = async ({ request, locals }) => {
	// Must be a moderator or higher
	if (!locals.session) {
		error(...getCustomError('not-logged-in'));
	}

	if (!isAtLeastModerator(locals.session?.user.role)) {
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

		// const imgExtension = image.type.split('/')[1];
		// const fileEsque = new File([image], `${crypto.randomUUID()}.${imgExtension}`, {
		// 	type: image.type
		// });
		// console.log('fileEsque', fileEsque);

		const { data, error } = await utapi.uploadFiles(image);

		if (error) {
			console.error('product.edit.images', error);
			return setError(form, 'Nie udało się przesłać obrazka', { status: 500 });
		}

		console.log('imageUrl', imageUrl);
		imageUrl = data.url;
	}

	const newProduct: Partial<
		Pick<
			Product,
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
		newProduct.price = price.toString();
	}

	if (producent) {
		newProduct.producent = producent;
	}

	if (weight) {
		newProduct.weight = weight.toString();
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
			.update(products)
			.set({
				...newProduct
			})
			.where(eq(products.id, id))
	);

	if (editProductError) {
		// Unexpected-error
		console.error('editProductError', editProductError);
		return setError(form, 'Nie udało się edytować użytkownika', { status: 500 });
	}

	return setMessage(form, 'Edytowano produkt');
};

export default edit;
