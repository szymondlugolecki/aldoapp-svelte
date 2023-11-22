// import { p } from '$lib/server/clients/pClient';
import { error, type Action, fail } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import getCustomError from '$lib/client/constants/customErrors';
import { isAtLeastModerator } from '$lib/client/functions';
import { products$ } from '$lib/client/schemas';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
// import { uploadFile } from '$lib/server/clients/backblaze';
import * as Bytescale from '@bytescale/sdk';
import nodeFetch from 'node-fetch';
import fileToArrayBuffer from 'file2arraybuffer';
import { products, type Product } from '$lib/server/db/schemas/products';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';

const uploadManager = new Bytescale.UploadManager({
	fetchApi: nodeFetch as any, // import nodeFetch from "node-fetch"; // Only required for Node.js. TypeScript: 'nodeFetch as any' may be necessary.
	apiKey: 'public_W142iLN7owvrifLvXWpbYdspQnhJ' // This is your API key.
});

const edit: Action = async ({ request, locals }) => {
	// Must be a moderator or higher
	if (!locals.session) {
		throw error(...getCustomError('not-logged-in'));
	}

	if (!isAtLeastModerator(locals.session?.user.role)) {
		throw error(...getCustomError('insufficient-permissions'));
	}

	const formData = await request.formData();
	const form = await superValidate(formData, products$.editForm);

	if (!form.valid) return fail(400, { form });

	// Make sure something else other than id was provided
	if (Object.keys(form.data).length <= 1) {
		return setError(form, 'Nie podano żadnych danych do edycji', { status: 400 });
	}

	const { id, name, symbol, category, subcategory, price, producent, weight, description } =
		form.data;

	let imageUrl: string | undefined = undefined;

	const uploadedImage = formData.get('images');
	if (uploadedImage instanceof File) {
		console.log('uploadedImage', uploadedImage);
		// const [, imageError] = betterZodParse(products$.image, uploadedImage);

		// if (imageError) {
		// return setError(form, 'images', imageError[0]);
		// }

		const file = await fileToArrayBuffer(uploadedImage);

		const [uploadData, uploadError] = await trytm(
			uploadManager.upload({
				// Supported types:
				// - String
				// - Blob
				// - ArrayBuffer
				// - Buffer
				// - ReadableStream (Node.js), e.g. fs.createReadStream("file.txt")
				data: Buffer.from(file),

				// Required if 'data' is a stream, buffer, or string.
				mime: 'text/plain',

				// Required if 'data' is a stream, buffer, or string.
				originalFileName: uploadedImage.name

				// Required if 'data' is a stream.
				// size: 5098, // e.g. fs.statSync("file.txt").size
			})
		);

		if (uploadError) {
			// Unexpected-error
			console.error('uploadError', uploadError);
			return setError(form, 'Nie udało się zmienić zdjęcia', { status: 500 });
		}

		const { fileUrl, filePath } = uploadData;

		console.log(`File uploaded to: ${fileUrl}`, filePath);
		imageUrl = fileUrl;
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
