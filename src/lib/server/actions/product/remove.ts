import { prisma } from '$prisma';
import { error, fail, type Action } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { errorResponses } from '$lib/server/constants/errorResponses';
import { removeProductSchema } from '$lib/client/schemas/products';

const remove: Action = async ({ request, locals }) => {
	// Only moderators and admins are allowed to remove a product
	if (!locals.session) {
		throw error(...errorResponses[401]);
	}
	if (!['admin', 'moderator'].includes(locals.session?.user.role)) {
		throw error(...errorResponses[403]);
	}

	const data = Object.fromEntries(await request.formData());
	console.log('data', data);

	// Validate the user input
	const [removeProductObj, removeProductSchemaError] = betterZodParse(
		removeProductSchema.parse(data)
	);
	if (removeProductSchemaError) {
		return fail(400, {
			errors: ['Niepoprawne dane']
		});
	}

	// Remove the product from the database
	const [, removeProductError] = await trytm(
		prisma.product.delete({
			where: {
				id: removeProductObj.id
			}
		})
	);

	if (removeProductError) {
		return fail(500, {
			errors: ['Nie udało się usunąć produktu']
		});
	}

	return { success: true, message: 'Pomyślnie usunięto produkt' };
};

export default remove;
