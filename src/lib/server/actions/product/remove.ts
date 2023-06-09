// import { p } from '$lib/server/clients/pClient';
import { error, fail, type Action } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { errorResponses } from '$lib/client/constants/errorResponses';
import { removeProductSchema } from '$lib/client/schemas/products';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schemas/products';
import { eq } from 'drizzle-orm';
import { isAtLeastModerator } from '$lib/client/functions';

const remove: Action = async ({ request, locals }) => {
	// Only moderators and admins are allowed to remove a product
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

	const data = {
		...Object.fromEntries(formData),
		id: Number(Object.fromEntries(formData).id)
	};

	// Validate the user input
	const [removeProductObj, removeProductSchemaError] = betterZodParse(removeProductSchema, data);
	if (removeProductSchemaError) {
		return fail(400, {
			errors: ['Niepoprawne dane']
		});
	}

	// Remove the product from the database
	const [, removeProductError] = await trytm(
		db.delete(products).where(eq(products.id, removeProductObj.id))
	);

	if (removeProductError) {
		console.log('removeProductError', removeProductError);
		return fail(500, {
			errors: ['Nie udało się usunąć produktu']
		});
	}

	return { success: true, message: 'Pomyślnie usunięto produkt' };
};

export default remove;

// p.product.delete({
// 	where: {
// 		id: removeProductObj.id
// 	}
// })
