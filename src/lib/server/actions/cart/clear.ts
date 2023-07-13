import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { error, type Action, fail } from '@sveltejs/kit';
import { cartProducts } from '$lib/server/db/schemas/cartProducts';
import { eq } from 'drizzle-orm';

const removeFromCart: Action = async ({ locals }) => {
	const sessionUser = locals.session?.user;

	if (!sessionUser) {
		throw error(401, 'Nie jesteś zalogowany');
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
			errors: ['Nie można wyczyścic koszyka, ponieważ nie istnieje']
		});
	}

	// Remove all products in the cart
	const [, removeProductsError] = await trytm(
		db.delete(cartProducts).where(eq(cartProducts.cartId, cart.id))
	);

	if (removeProductsError) {
		// Unexpected-error
		throw error(500, 'Wystąpił błąd podczas czyszczenia koszyka');
	}

	return { success: true };
};

export default removeFromCart;
