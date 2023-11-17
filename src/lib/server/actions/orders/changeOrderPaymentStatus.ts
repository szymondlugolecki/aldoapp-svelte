import getCustomError from '$lib/client/constants/customErrors';
// import { p } from '$lib/server/clients/pClient';
import { trytm } from '@bdsqqq/try';
import { error, fail, type Action } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { isAtLeastModerator } from '$lib/client/functions';
import { orders } from '$lib/server/db/schemas/orders';
import { eq } from 'drizzle-orm';
import { order$ } from '$lib/client/schemas';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';

const changeOrderPaymentStatus = (async ({ request, locals }) => {
	const sessionUser = locals.session?.user;

	// Only moderators and admins are allowed to edit a user
	if (!sessionUser) {
		throw error(...getCustomError('not-logged-in'));
	}
	if (!isAtLeastModerator(sessionUser.role)) {
		throw error(403, 'Nie masz wystarczających uprawień');
	}

	const form = await superValidate(request, order$.paymentForm);
	if (!form.valid) {
		return fail(400, { form });
	}

	const { paid, id } = form.data;

	// Update the order
	const [, editOrderPaidError] = await trytm(
		db
			.update(orders)
			.set({
				paid
			})
			.where(eq(orders.id, id))
	);

	if (editOrderPaidError) {
		// Unexpected-error
		console.error('editOrderPaidError', editOrderPaidError);
		return setError(form, 'paid', 'Nie udało się zmienić statusu płatności zamówienia', {
			status: 500
		});
	}

	return setMessage(form, 'Pomyślnie zmieniono status płatności');
}) satisfies Action;

export default changeOrderPaymentStatus;
