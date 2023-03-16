import { addProductSchema } from '$lib/client/schemas/products';
import { prisma } from '$lib/server/clients/prismaClient';
import { error, fail, type Action } from '@sveltejs/kit';
import { cloudinary } from '$lib/server/clients/cloudinaryClient';
import { trytm } from '@bdsqqq/try';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { errorResponses } from '$lib/client/constants/errorResponses';

const add: Action = async ({ request, locals }) => {
	// Only moderators and admins are allowed to add a product
	if (!locals.session) {
		throw error(...errorResponses[401]);
	}
	if (!['admin', 'moderator'].includes(locals.session?.user.role)) {
		throw error(...errorResponses[403]);
	}

	// Validate the user input
	const formData = await request.formData();
	// Need to extract the images from the formData before using Object.fromEntries
	// Because then the images overwrite each other
	const imageArray = formData.getAll('images');

	const data = {
		...Object.fromEntries(formData),
		price: Number(formData.get('price')),
		images: imageArray
	};

	console.log('data', data);

	const [addProductObj, addProductParseError] = betterZodParse(addProductSchema, data);
	if (addProductParseError) {
		return fail(400, {
			errors: addProductParseError
		});
	}
	const { name, symbol, description, images, category, subcategory } = addProductObj;

	// Handle the thumbnail
	let imagesURL: string[] = [];

	if (images && images.length) {
		const totalImagesSize = images.reduce((acc, curr) => acc + curr.size, 0) / 1024 / 1024; // in MiB

		console.log('totalImagesSize', totalImagesSize);

		if (totalImagesSize > 10) {
			return fail(400, {
				errors: ['Maxymalny rozmiar zdjęć to 10MB']
			});
		}

		try {
			const uploadPromises = images
				.filter((img) => img.size > 0)
				.map(async (image, index) => {
					console.log('poggers', index);
					const imageArrayBuffer = await image.arrayBuffer();
					const imageBuffer = Buffer.from(imageArrayBuffer).toString('base64');
					console.log('imageBuffer', imageBuffer.slice(0, 125));
					const result = await cloudinary.uploader.upload(
						`data:${image.type};base64,${imageBuffer}`,
						{
							public_id: `products/${symbol}/${index}`,
							overwrite: true
						}
					);
					return result;
				});

			const result = await Promise.all(uploadPromises);

			imagesURL = result.map((image) => image.secure_url);
		} catch (error) {
			// console.error(error);
			return fail(400, {
				errors: ['Wystąpił błąd poczas przesyłania zdjęć']
			});
		}
	}

	console.log('imagesURL', imagesURL);

	// Add the product to the database
	const [, addProductError] = await trytm(
		prisma.product.create({
			data: {
				userId: locals.session.user.id,
				name,
				symbol,
				description,
				images: {
					createMany: {
						data: imagesURL.map((url) => ({
							url
						}))
					}
				},
				category,
				subcategory: subcategory ?? ''
			}
		})
	);

	if (addProductError) {
		return fail(500, {
			errors: ['Nie udało się dodać produktu']
		});
	}

	return { success: true, message: 'Pomyślnie dodano produkt' };
};

export default add;
