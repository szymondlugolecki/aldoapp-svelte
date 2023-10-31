import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { setCartProductQuantity, createCart } from '$lib/server/functions/db';
import { error, type Action, fail } from '@sveltejs/kit';
import { cart$ } from '$lib/client/schemas';
import { setMessage, superValidate } from 'sveltekit-superforms/server';

const changeProductQuantity: Action = async ({ request, locals }) => {
	const sessionUser = locals.session?.user;
	if (!sessionUser) {
		throw error(401, 'Nie jesteś zalogowany');
	}

	const form = await superValidate(request, cart$.changeProductQuantity);
	console.log('form.id', form.id);
	if (!form.valid) {
		return fail(400, { form });
	}

	// Fetch user's cart
	const [cart, fetchCartError] = await trytm(
		db.query.carts.findFirst({
			where: (carts, { eq }) => eq(carts.ownerId, sessionUser.id)
		})
	);

	if (fetchCartError) {
		throw error(500, 'Błąd podczas sprawdzania czy istnieje koszyk');
	}

	// If no cart, create one
	if (!cart) {
		// This shouldnt technically happen
		// Once a user is created, a cart is created for them
		// But just in case
		const [, createCartError] = await trytm(createCart(sessionUser.id));

		if (createCartError) {
			throw error(500, 'Błąd podczas tworzenia koszyka');
		}

		throw error(500, 'Spróbuj ponownie');
	}

	// Change product quantity
	const { productId: id, quantity } = form.data;
	const [, changeProductQuantityError] = await trytm(setCartProductQuantity(cart.id, id, quantity));

	if (changeProductQuantityError) {
		// Unexpected-error
		console.error('Failed to change product quantity', changeProductQuantityError);
		throw error(500, 'Błąd podczas zmieniania ilości produktu');
	}

	if (quantity === 0) {
		return setMessage(form, 'Usunięto produkt z koszyka');
	} else if (quantity === 1) {
		return setMessage(form, 'Dodano produkt do koszyka');
	}

	return { form };
};

export default changeProductQuantity;
