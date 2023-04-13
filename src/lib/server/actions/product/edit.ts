import { error, type Action } from '@sveltejs/kit';

const edit: Action = async () => {
	throw error(400, 'NARAZIE NIE DA SIE EDYTOWAC PRODUKTOW');
};

export default edit;

/*
import { editProductSchema } from '$lib/client/schemas/products';
import { prisma } from '$lib/server/clients/prismaClient';
import { error, fail, type Action } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { errorResponses } from '$lib/client/constants/errorResponses';
import type { Product } from '@prisma/client';
import { areObjectsEqual } from '$lib/server/functions/utils';
import { productURLParser } from '$lib/client/functions';

const edit: Action = async ({ request, locals }) => {
	// Only moderators and admins are allowed to edit a product
	if (!locals.session) {
		throw error(...errorResponses[401]);
	}
	if (!isAtLeastModerator(locals.session?.user.role)) {
		throw error(...errorResponses[403]);
	}

	// Validate the user input
	const data = Object.fromEntries(await request.formData());

	const [editProductObj, addProductParseError] = betterZodParse(editProductSchema, data);
	if (addProductParseError) {
		return fail(400, {
			errors: ['Niepoprawne dane']
		});
	}
	const { id, name, symbol, description, images, category, price, subcategory } = editProductObj;

	// Fetch the previous product data (current, before the edit)
	// 1. To see if the product even exists
	// 2. Additionally, we check if anything has changed, else we do not call the db to save resources
	const [productBeforeEdit, productBeforeEditError] = await trytm(
		prisma.product.findFirstOrThrow({
			where: {
				id
			},
			select: {
				id: true,
				name: true,
				symbol: true,
				description: true,
				images: {
					select: {
						url: true
					}
				}
			}
			// include: {
			// 	images: {
			// 		select: {
			// 			url: true,
			// 		}
			// 	}
			// }
		})
	);

	if (productBeforeEditError) {
		return fail(400, {
			errors: ['Niepowodzenie w znalezieniu produktu']
		});
	}

	const encodedURL = productURLParser(name, symbol);

	const newProductObj: Partial<Product> = {
		name,
		symbol,
		description,
		encodedURL
	};

	const { name: bName, symbol: bSymbol, description: bDescription } = productBeforeEdit;

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

	// Edit the product in the database
	const [, editProductError] = await trytm(
		prisma.product.update({
			where: {
				id
			},
			data: {
				...newProductObj
				// images: {
				// 	set: images ? images?.map(({  }) => ({ url })) : []
				// }
			},
			select: {
				id: true
			}
		})
	);

	if (editProductError) {
		return fail(500, {
			errors: ['Nie udało się edytować produktu']
		});
	}

	return { success: true, message: 'Pomyślnie edytowano produkt' };
};

export default edit;


*/
