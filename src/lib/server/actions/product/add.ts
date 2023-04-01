import { addProductSchema } from '$lib/client/schemas/products';
// import { p } from '$lib/server/clients/pClient';
import { error, fail, type Action } from '@sveltejs/kit';
import { cloudinary } from '$lib/server/clients/cloudinaryClient';
import { trytm } from '@bdsqqq/try';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { errorResponses } from '$lib/client/constants/errorResponses';
import { productURLParser } from '$lib/client/functions';
import { db } from '$lib/server/db';
import { products, type Product } from '$lib/server/db/schemas/products';

const add: Action = async ({ request, locals }) => {
	// Only moderators and admins are allowed to add a product
	if (!locals.session) {
		throw error(...errorResponses[401]);
	}
	if (!['admin', 'moderator'].includes(locals.session?.user.role)) {
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
	const imageArray = formData.getAll('images');

	const data = {
		...Object.fromEntries(formData),
		weight: Number(formData.get('weight')?.toString().replace(',', '.')),
		price: Number(formData.get('price')?.toString().replace(',', '.')),
		images: imageArray
	};

	console.log('data', data);

	const [addProductObj, addProductParseError] = betterZodParse(addProductSchema, data);
	if (addProductParseError) {
		return fail(400, {
			errors: addProductParseError
		});
	}
	const { name, symbol, description, images, category, subcategory, price, weight, producent } =
		addProductObj;

	// Handle the thumbnail
	let imagesURL: string[] = [];

	if (images && images.length) {
		const totalImagesSize = images.reduce((acc, curr) => acc + curr.size, 0) / 1024 / 1024; // in MiB

		console.log('Total Images Size', totalImagesSize);

		if (totalImagesSize > 10) {
			return fail(400, {
				errors: ['Maksymalny rozmiar zdjęć to 10MB']
			});
		}

		// Move the thumbnail to the first position
		// images.unshift(images.splice(thumbnail, 1)[0]);

		try {
			const uploadPromises = images
				.filter((image) => image.size > 0)
				.map(async (image, index) => {
					console.log('Image nr', index, ':', image.name, image.size, image.type);
					const imageArrayBuffer = await image.arrayBuffer();
					const imageBuffer = Buffer.from(imageArrayBuffer).toString('base64');
					return await cloudinary.uploader.upload(`data:${image.type};base64,${imageBuffer}`, {
						public_id: `products/${symbol}/${index}`,
						overwrite: true
					});
				});

			const result = await Promise.all(uploadPromises);

			// Sort the images by their index
			result.sort(
				(a, b) => Number(a.public_id.split('/').pop()) - Number(b.public_id.split('/').pop())
			);

			console.log(
				'after sort result',
				result.map((image) => image.public_id)
			);

			imagesURL = result.map((image) => image.secure_url);
		} catch (error) {
			console.error('image upload error', error);
			return fail(400, {
				errors: ['Wystąpił błąd poczas przesyłania zdjęć']
			});
		}
	}

	console.log('imagesURL', imagesURL);

	const encodedURL = productURLParser(name, symbol);

	const newProduct = {
		authorId: locals.session.user.id,
		name,
		symbol,
		description: description || null,
		images: imagesURL,
		category,
		subcategory: subcategory ?? '',
		price,
		weight,
		producent,
		encodedURL,
		amountLeft: Math.floor(Math.random() * 5) // 0 - 5
	} satisfies Omit<Product, 'id' | 'createdAt'>;

	// Add the product to the database
	const [, addProductError] = await trytm(db.insert(products).values(newProduct));
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

// p.product.create({
// 	data: {
// 		id: productId,
// 		userId: locals.session.user.id,
// 		name,
// 		symbol,
// 		description,
// 		images: {
// 			createMany: {
// 				data: imagesURL.map((url) => ({
// 					url
// 				}))
// 			}
// 		},
// 		category,
// 		subcategory: subcategory ?? '',
// 		price,
// 		weight,
// 		producent,
// 		encodedURL,
// 		amountLeft: Math.floor(Math.random() * 5) // 0 - 5
// 	}
// })
