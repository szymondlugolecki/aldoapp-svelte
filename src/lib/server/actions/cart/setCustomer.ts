import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { error, type Action, fail } from '@sveltejs/kit';
import { changePaymentMethod } from '$lib/server/functions/db';
import { changePaymentMethodRequestSchema } from '$lib/client/schemas/cart';
import { betterZodParse } from '$lib/client/functions/betterZodParse';

const setCustomer: Action = async ({ locals, request }) => {
	const sessionUser = locals.session?.user;

	if (!sessionUser) {
		throw error(401, 'Nie jesteś zalogowany');
	}

	// Validate the user input
	const [formData, formDataError] = await trytm(request.formData());
	console.log('changePaymentMethod', 'formData', formData);
	if (formDataError) {
		return fail(400, {
			errors: ['Nieprawidłowa metoda płatności']
		});
	}

	const entries = Object.fromEntries(formData);

	console.log('changePaymentMethod', 'entries', entries);

	// Validate the request body
	const [data, parseError] = betterZodParse(changePaymentMethodRequestSchema, entries);
	if (parseError) {
		console.error('Failed to validate the change payment method request body', parseError);
		return fail(400, {
			errors: parseError
		});
	}

	// Check if user has a cart
	const [cart, fetchCartError] = await trytm(
		db.query.carts.findFirst({
			where: (carts, { eq }) => eq(carts.ownerId, sessionUser.id)
		})
	);

	if (fetchCartError) {
		return fail(500, {
			errors: ['Wystąpił błąd podczas sprawdzania czy istnieje koszyk']
		});
	}

	// No cart
	if (!cart) {
		return fail(400, {
			errors: ['Nie można zmienić metody płatności, ponieważ koszyk nie istnieje']
		});
	}

	// Remove all products in the cart
	const [, changePaymentMethodError] = await trytm(
		changePaymentMethod(cart.id, data.paymentMethod)
	);

	if (changePaymentMethodError) {
		// Unexpected-error
		throw error(500, 'Wystąpił błąd podczas zmieniania metody płatności');
	}

	return { success: true };
};

export default setCustomer;
