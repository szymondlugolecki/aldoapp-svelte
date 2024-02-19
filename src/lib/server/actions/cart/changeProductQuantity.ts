import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { setCartProductQuantity } from '$lib/server/functions/db';
import { type Action, fail, redirect } from '@sveltejs/kit';
import { cart$ } from '$lib/client/schemas';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';

const changeProductQuantity: Action = async ({ request, locals }) => {
	const sessionUser = locals.user;
	if (!sessionUser) {
		redirect(303, '/zaloguj');
	}

	const form = await superValidate(request, cart$.changeProductQuantity);
	console.log('form.id', form.id);
	if (!form.valid) {
		return fail(400, { form });
	}

	// Fetch user's cart
	const [cart, fetchCartError] = await trytm(
		db.query.cartsTable.findFirst({
			where: (carts, { eq }) => eq(carts.ownerId, sessionUser.id)
		})
	);

	if (fetchCartError) {
		// Unexpected-error
		console.error('Failed to fetch cart', fetchCartError);
		return setError(form, 'Błąd serwera podczas pobierania koszyka', { status: 500 });
	}

	// No cart
	if (!cart) {
		// This shouldnt technically happen
		return setError(form, 'Twój koszyk nie istnieje. Skontaktuj się z administratorem', {
			status: 500
		});
	}

	// Change product quantity
	const { productId: id, quantity } = form.data;
	const [, changeProductQuantityError] = await trytm(setCartProductQuantity(cart.id, id, quantity));

	if (changeProductQuantityError) {
		// Unexpected-error
		console.error('Failed to change product quantity', changeProductQuantityError);
		return setError(form, 'Błąd serwera podczas zmieniania ilości produktu', { status: 500 });
	}

	if (quantity === 0) {
		return setMessage(form, 'Usunięto produkt z koszyka');
	} else if (quantity === 1) {
		return setMessage(form, 'Dodano produkt do koszyka');
	}

	return { form };
};

export default changeProductQuantity;
