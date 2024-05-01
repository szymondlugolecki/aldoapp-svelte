import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { error, type Action, redirect } from '@sveltejs/kit';
import { changeCartCustomer } from '$lib/server/functions/db';
import { isAtLeastModerator } from '$lib/client/functions';
import { cart$ } from '$lib/client/schemas';
import { setError, setMessage, superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import getCustomError from '$lib/client/constants/customErrors';

const setCustomer: Action = async (event) => {
	const sessionUser = event.locals.user;
	if (!sessionUser) {
		redirect(303, '/zaloguj');
		// error(...getCustomError('not-logged-in'));;
	}
	if (!isAtLeastModerator(sessionUser.role)) {
		error(...getCustomError('insufficient-permissions'));
	}

	const form = await superValidate(event, zod(cart$.changeCartCustomer));
	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	// Check if user has a cart
	const [cart, fetchCartError] = await trytm(
		db.query.cartsTable.findFirst({
			where: (carts, { eq }) => eq(carts.ownerId, sessionUser.id)
		})
	);

	if (fetchCartError) {
		return setError(form, 'Błąd serwera podczas pobierania koszyka', { status: 500 });
	}

	// No cart
	if (!cart) {
		return setError(form, 'Twój koszyk nie istnieje. Skontaktuj się z administratorem', {
			status: 500
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
