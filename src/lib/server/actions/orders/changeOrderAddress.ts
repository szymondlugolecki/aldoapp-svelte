// import getCustomError from '$lib/client/constants/customErrors';
// import { p } from '$lib/server/clients/pClient';
import { trytm } from '@bdsqqq/try';
import { error, redirect, type Action } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { isAtLeastModerator } from '$lib/client/functions';
import { eq } from 'drizzle-orm';
import { order$ } from '$lib/client/schemas';
import { setError, setMessage, superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { orderAddressTable } from '$lib/server/db/schemas/orderAddress';

const changeOrderAddress = (async ({ request, locals }) => {
	const sessionUser = locals.user;

	// Only moderators and admins are allowed
	if (!sessionUser) {
		redirect(303, '/zaloguj');
		// error(...getCustomError('not-logged-in'));;
	}
	if (!isAtLeastModerator(sessionUser.role)) {
		error(403, 'Nie masz wystarczających uprawień');
	}

	const form = await superValidate(request, zod(order$.orderAddressForm));
	if (!form.valid) {
		return fail(400, { form });
	}

	const { city, street, zipCode, id } = form.data;

	// Update the order
	const [, editOrderPaidError] = await trytm(
		db
			.update(orderAddressTable)
			.set({
				city,
				street,
				zipCode
			})
			.where(eq(orderAddressTable.orderId, id))
	);

	if (editOrderPaidError) {
		// Unexpected-error
		console.error('editOrderPaidError', editOrderPaidError);
		return setError(form, 'Błąd serwera podczas zmieniania adresu dostawy', {
			status: 500
		});
	}

	return setMessage(form, 'Zmieniono adres dostawy');
}) satisfies Action;

export default changeOrderAddress;
