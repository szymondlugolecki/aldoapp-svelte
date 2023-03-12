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
	const data = Object.fromEntries(await request.formData());
	console.log('data', data);

	const [addProductObj, addProductParseError] = betterZodParse(addProductSchema.parse(data));
	if (addProductParseError) {
		return fail(400, {
			errors: ['Niepoprawne dane']
		});
	}
	const { name, symbol, description, thumbnail } = addProductObj;

	// Handle the thumbnail
	let thumbnailUrl: string | undefined;

	if (thumbnail && thumbnail.size > 0) {
		const fileSize = thumbnail.size / 1024 / 1024; // in MiB

		if (fileSize > 3) {
			return fail(400, {
				errors: ['Plik jest zbyt duży. Maksymalny rozmiar to 3MB']
			});
		}

		const thumbnailArrBuffer = await thumbnail.arrayBuffer();
		const base64Image = Buffer.from(thumbnailArrBuffer).toString('base64');

		const [result, productThumbnailUploadError] = await trytm(
			cloudinary.uploader.upload(base64Image, { public_id: `produkty/${symbol}` })
		);
		if (productThumbnailUploadError) {
			return fail(400, {
				errors: ['Nie udało się przesłać zdjęcia']
			});
		}

		console.log(result.secure_url);
		thumbnailUrl = result.secure_url;
	}

	// Add the product to the database
	// const [, addProductError] = await trytm(
	// 	prisma.product.create({
	// 		data: {
	// 			userId: locals.session.user.id,
	// 			name,
	// 			symbol,
	// 			description
	// 			// images: {
	// 			// 	create: {
	// 			// 		url: thumbnailUrl || ''
	// 			// 	}
	// 			// },
	// 		}
	// 	})
	// );

	// if (addProductError) {
	// 	return fail(500, {
	// 		errors: ['Nie udało się dodać produktu']
	// 	});
	// }

	return { success: true, message: 'Pomyślnie dodano produkt' };
};

export default add;
