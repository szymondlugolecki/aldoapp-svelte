import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { error, type Action, fail } from '@sveltejs/kit';
import { changeCartCustomer } from '$lib/server/functions/db';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { isAtLeastModerator } from '$lib/client/functions';
import { cart$ } from '$lib/client/schemas';

const setCustomer: Action = async ({ locals, request }) => {
	const sessionUser = locals.session?.user;

	if (!sessionUser) {
		throw error(401, 'Nie jesteś zalogowany');
	}

	if (!isAtLeastModerator(sessionUser.role)) {
		throw error(403, 'Niewystarczające uprawnienia');
	}

	// Validate the user input
	const [formData, formDataError] = await trytm(request.formData());
	console.log('setCartCustomer', 'formData', formData);
	if (formDataError) {
		return fail(400, {
			errors: ['Nieprawidłowy klient']
		});
	}

	const entries = Object.fromEntries(formData);

	console.log('setCartCustomer', 'entries', entries);

	// Validate the request body
	const [data, parseError] = betterZodParse(cart$.changeCartCustomer, entries);
	if (parseError) {
		console.error('Failed to validate the change of cart customer', parseError);
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
			errors: ['Nie można zmienić klienta, ponieważ koszyk nie istnieje']
		});
	}

	// Remove all products in the cart
	const [, changePaymentMethodError] = await trytm(changeCartCustomer(cart.id, data.customerId));

	if (changePaymentMethodError) {
		// Unexpected-error
		throw error(500, 'Wystąpił błąd podczas zmieniania metody płatności');
	}

	return { success: true };
};

export default setCustomer;
