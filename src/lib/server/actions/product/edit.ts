// import { type Action, fail } from '@sveltejs/kit';

// const edit: Action = async () => {
// 	return fail(400, {
// 		errors: ['NARAZIE NIE DA SIE EDYTOWAC PRODUKTOW']
// 	});
// };

// export default edit;

// /*
import { editProductSchema } from '$lib/client/schemas/products';
import { error, fail, type Action } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { errorResponses } from '$lib/client/constants/errorResponses';
import { isAtLeastModerator, productURLParser } from '$lib/client/functions';
import { db } from '$lib/server/db';
import { products, type Product } from '$lib/server/db/schemas/products';
import { eq } from 'drizzle-orm';

// Handle the thumbnail
// let imagesURL: string[] = [];

// if (images && images.length) {
// 	const totalImagesSize = images.reduce((acc, curr) => acc + curr.size, 0) / 1024 / 1024; // in MiB

// 	console.log('Total Images Size', totalImagesSize);

// 	if (totalImagesSize > 10) {
// 		return fail(400, {
// 			errors: ['Maksymalny rozmiar zdjęć to 10MB']
// 		});
// 	}

// 	// Move the thumbnail to the first position
// 	// images.unshift(images.splice(thumbnail, 1)[0]);

// 	try {
// 		const uploadPromises = images
// 			.filter((image) => image.size > 0)
// 			.map(async (image, index) => {
// 				console.log('Image nr', index, ':', image.name, image.size, image.type);
// 				const imageArrayBuffer = await image.arrayBuffer();
// 				const imageBuffer = Buffer.from(imageArrayBuffer).toString('base64');
// 				return await cloudinary.uploader.upload(`data:${image.type};base64,${imageBuffer}`, {
// 					public_id: `products/${name}/${symbol}/${index}`,
// 					// background_removal: 'cloudinary_ai',
// 					overwrite: true
// 				});
// 			});

// 		const result = await Promise.all(uploadPromises);

// 		// Sort the images by their index
// 		result.sort(
// 			(a, b) => Number(a.public_id.split('/').pop()) - Number(b.public_id.split('/').pop())
// 		);

// 		console.log(
// 			'after sort result',
// 			result.map((image) => image.public_id)
// 		);

// 		imagesURL = result.map((image) => image.secure_url);
// 	} catch (error) {
// 		console.error('image upload error', error);
// 		return fail(400, {
// 			errors: ['Wystąpił błąd poczas przesyłania zdjęć']
// 		});
// 	}
// }

// console.log('imagesURL', imagesURL);

const edit: Action = async ({ request, locals }) => {
	// Only moderators and admins are allowed to edit a product
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

	const entries = Object.fromEntries(formData);

	const data = {
		...entries,
		id: Number(entries.id),
		...(entries.weight && typeof entries.weight === 'string'
			? { weight: Number(entries.weight.replace(',', '.')) }
			: {}),
		...(entries.price && typeof entries.price === 'string'
			? { price: Number(entries.price.replace(',', '.')) }
			: {})
	};

	console.log('data', data);

	const [updateProductData, updateProductDataError] = betterZodParse(editProductSchema, data);
	if (updateProductDataError) {
		return fail(400, {
			errors: [updateProductDataError[0]]
		});
	}

	const { id, name, symbol, description, images, category, subcategory, price, weight, producent } =
		updateProductData;

	const [currentProduct, currentProductError] = await trytm(
		db.query.products.findFirst({
			where: (products, { eq }) => eq(products.id, id)
		})
	);

	if (currentProductError) {
		return fail(500, {
			errors: ['Niespodziewany błąd przy szukaniu produktu do edycji']
		});
	}

	if (!currentProduct) {
		return fail(400, {
			errors: ['Nie udało się znaleźć produktu, który chcesz edytować']
		});
	}

	const newProduct: Partial<Product> = {};

	if (name || symbol) {
		newProduct.encodedURL = productURLParser(
			name || currentProduct.name,
			symbol || currentProduct.symbol
		);
	}

	if (name) {
		newProduct.name = name;
	}

	if (symbol) {
		newProduct.symbol = symbol;
	}

	if (description) {
		newProduct.description = description;
	}

	if (category) {
		newProduct.category = category;

		if (subcategory) {
			newProduct.subcategory = subcategory;
		} else if (category === 'backyard') {
			newProduct.subcategory = null;
		} else {
			// should never happen but just in case
			return fail(400, {
				errors: ['Nie podano podkategorii']
			});
		}
	}

	if (price) {
		newProduct.price = price.toString();
	}

	if (weight) {
		newProduct.weight = weight.toString();
	}

	if (producent) {
		newProduct.producent = producent;
	}

	if (Object.values(newProduct).length === 0) {
		return fail(400, {
			errors: ['Nie podano żadnych danych do edycji']
		});
	}

	console.log('newProduct', newProduct);

	// If nothing has changed, do not call the db to save resources
	// if (!thumbnail) {
	// 	const nothingChanged = areObjectsEqual(
	// 		{
	// 			name,
	// 			symbol,
	// 			description
	// 		},
	// 		{
	// 			name: bName,
	// 			symbol: bSymbol,
	// 			description: bDescription
	// 		}
	// 	);
	// 	if (nothingChanged) {
	// 		return { success: true, message: 'Pomyślnie edytowano produkt' };
	// 	}
	// }

	// Edit the product in the database=
	const [, editProductError] = await trytm(
		db.update(products).set(newProduct).where(eq(products.id, id))
	);

	if (editProductError) {
		return fail(500, {
			errors: ['Nie udało się edytować produktu']
		});
	}

	return { success: true, message: 'Pomyślnie edytowano produkt' };
};

export default edit;
