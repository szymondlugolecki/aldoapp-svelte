// import getCustomError from '$lib/client/constants/customErrors';
// import { p } from '$lib/server/clients/pClient';
import { trytm } from '@bdsqqq/try';
import { error, redirect, type Action } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { isAtLeastModerator } from '$lib/client/functions';
import { ordersTable } from '$lib/server/db/schemas/orders';
import { eq } from 'drizzle-orm';
import { order$ } from '$lib/client/schemas';
import { setError, setMessage, superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const changeOrderPaymentStatus = (async ({ request, locals }) => {
	const sessionUser = locals.user;

	// Only moderators and admins are allowed to edit a user
	if (!sessionUser) {
		redirect(303, '/zaloguj');
		// error(...getCustomError('not-logged-in'));;
	}
	if (!isAtLeastModerator(sessionUser.role)) {
		error(403, 'Nie masz wystarczających uprawień');
	}

	const form = await superValidate(request, zod(order$.paymentForm));
	if (!form.valid) {
		return fail(400, { form });
	}

	const { paid, id } = form.data;

	// Update the order
	const [, editOrderPaidError] = await trytm(
		db
			.update(ordersTable)
			.set({
				paid
			})
			.where(eq(ordersTable.id, id))
	);

	if (editOrderPaidError) {
		// Unexpected-error
		console.error('editOrderPaidError', editOrderPaidError);
		return setError(form, 'paid', 'Błąd serwera podczas zmieniania statusu płatności', {
			status: 500
		});
	}

	return setMessage(form, 'Zmieniono status płatności');
}) satisfies Action;

export default changeOrderPaymentStatus;
