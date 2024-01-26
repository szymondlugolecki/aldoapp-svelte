import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { error, type Action, fail } from '@sveltejs/kit';
import { changeCartCustomer } from '$lib/server/functions/db';
import { isAtLeastModerator } from '$lib/client/functions';
import { cart$ } from '$lib/client/schemas';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';
import getCustomError from '$lib/client/constants/customErrors';

const setCustomer: Action = async (event) => {
	const sessionUser = event.locals.session?.user;
	if (!sessionUser) {
		error(...getCustomError('not-logged-in'));
	}
	if (!isAtLeastModerator(sessionUser.role)) {
		error(...getCustomError('insufficient-permissions'));
	}

	const form = await superValidate(event, cart$.changeCartCustomer);
	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	// Check if user has a cart
	const [cart, fetchCartError] = await trytm(
		db.query.carts.findFirst({
			where: (carts, { eq }) => eq(carts.ownerId, sessionUser.id)
		})
	);

	if (fetchCartError) {
		return setError(form, 'Błąd podczas sprawdzania czy istnieje koszyk', { status: 500 });
	}

	// No cart
	if (!cart) {
		return setError(form, 'Nie można zmienić klienta, ponieważ koszyk nie istnieje', {
			status: 400
		});
	}

	// Change the customer
	const [, changePaymentMethodError] = await trytm(
		changeCartCustomer(cart.id, form.data.customerId)
	);

	if (changePaymentMethodError) {
		// Unexpected-error
		return setError(form, 'Błąd podczas zmieniania klienta', { status: 500 });
	}

	return setMessage(form, 'Zmieniono klienta');
};

export default setCustomer;
