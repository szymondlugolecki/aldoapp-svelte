import { addProductSchema } from '$lib/client/schemas/products';
import { prisma } from '$lib/server/clients/prismaClient';
import { error, fail, type Action } from '@sveltejs/kit';
import { cloudinary } from '$lib/server/clients/cloudinaryClient';
import { trytm } from '@bdsqqq/try';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { errorResponses } from '$lib/client/constants/errorResponses';
import type { UploadApiResponse } from 'cloudinary';

const add: Action = async ({ request, locals }) => {
	// Only moderators and admins are allowed to add a product
	if (!locals.session) {
		throw error(...errorResponses[401]);
	}
	if (!['admin', 'moderator'].includes(locals.session?.user.role)) {
		throw error(...errorResponses[403]);
	}

	// Validate the user input
	const data = Object.fromEntries(await request.formData());
	console.log('data', data);

	const [addProductObj, addProductParseError] = betterZodParse(addProductSchema, data);
	if (addProductParseError) {
		return fail(400, {
			errors: ['Niepoprawne dane']
		});
	}
	const { name, symbol, description, images, category, subcategory } = addProductObj;

	// Handle the thumbnail
	let imagesURL: string[] = [];

	if (images && images.length) {
		const totalImagesSize = images.reduce((acc, curr) => acc + curr.size, 0) / 1024 / 1024; // in MiB

		if (totalImagesSize > 3) {
			return fail(400, {
				errors: ['Maxymalny rozmiar zdjęć to 3MB']
			});
		}

		const uploadPromises: Promise<UploadApiResponse>[] = [];

		images.forEach(async (image, index) => {
			if (image.size === 0) {
				return;
			}

			const imageArrBuffer = await image.arrayBuffer();
			const base64Image = Buffer.from(imageArrBuffer).toString('base64');

			uploadPromises.push(
				cloudinary.uploader.upload(base64Image, {
					public_id: `produkty/${symbol}/${index}`,
					overwrite: true
				})
			);
		});

		const [result, productThumbnailUploadError] = await trytm(Promise.all(uploadPromises));

		if (productThumbnailUploadError) {
			return fail(400, {
				errors: ['Wystąpił błąd poczas przesyłania zdjęć']
			});
		}

		imagesURL = result.map((image) => image.secure_url);
	}

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
				subcategory
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
