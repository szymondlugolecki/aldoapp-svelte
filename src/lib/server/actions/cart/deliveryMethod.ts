import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { error, type Action, fail, redirect } from '@sveltejs/kit';
import { changeDeliveryMethod } from '$lib/server/functions/db';
import { changeDeliveryMethodRequestSchema } from '$lib/client/schemas/cart';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import type { Address } from '$lib/server/db/schemas/orders';

const removeFromCart: Action = async ({ locals, request }) => {
	const sessionUser = locals.session?.user;

	if (!sessionUser) {
		throw error(401, 'Nie jesteś zalogowany');
	}

	// Validate the user input
	const [formData, formDataError] = await trytm(request.formData());
	console.log('changeDeliveryMethod', 'formData', formData);
	if (formDataError) {
		return fail(400, {
			errors: ['Nieprawidłowa metoda dostawy']
		});
	}

	const entries = Object.fromEntries(formData);

	const fixedEntries = {
		...entries,
		...(entries.customAddress && typeof entries.customAddress === 'string'
			? { customAddress: JSON.parse(entries.customAddress) as Address }
			: {})
	};

	console.log('changeDeliveryMethod', 'fixedEntries', fixedEntries);

	// Validate the request body
	const [data, parseError] = betterZodParse(changeDeliveryMethodRequestSchema, fixedEntries);
	if (parseError) {
		console.error('Failed to validate the change delivery method request body', parseError);
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
			errors: ['Nie można zmienić metody dostawy, ponieważ koszyk nie istnieje']
		});
	}

	// RChange the delivery method + custom address
	const [, changeDeliveryMethodError] = await trytm(
		changeDeliveryMethod(cart.id, data.deliveryMethod, data.customAddress)
	);

	if (changeDeliveryMethodError) {
		// Unexpected-error
		return fail(500, {
			errors: ['Wystąpił błąd podczas zmieniania metody dostawy']
		});
	}

	throw redirect(303, '/zamowienie/platnosc');
};

export default removeFromCart;
