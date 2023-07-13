import { trytm } from '@bdsqqq/try';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { changeProductQuantityRequestSchema } from '$lib/client/schemas/cart';
import { db } from '$lib/server/db';
import { createCart, deleteProduct } from '$lib/server/functions/db';
import { error, type Action, fail } from '@sveltejs/kit';

const removeFromCart: Action = async ({ request, locals }) => {
	const sessionUser = locals.session?.user;

	if (!sessionUser) {
		throw error(401, 'Nie jesteś zalogowany');
	}

	// Validate the user input
	// Validate the user input
	const [formData, formDataError] = await trytm(request.formData());
	console.log('removeFromCart', 'formData', formData);
	if (formDataError) {
		return fail(400, {
			errors: ['Nieprawidłowy produkt']
		});
	}

	const entries = Object.fromEntries(formData);
	console.log('entries', entries, entries.productId, Number(entries.productId));

	if (isNaN(Number(entries.productId))) {
		return fail(400, {
			errors: ['Nieprawidłowy produkt']
		});
	}

	const data = {
		productId: Number(entries.productId)
	};

	// Validate the request body
	const [cartProducts, parseError] = betterZodParse(changeProductQuantityRequestSchema, data);
	if (parseError) {
		console.error('Failed to validate the clear product from cart request body', parseError);
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
		throw error(500, 'Wystąpił błąd podczas sprawdzania czy istnieje koszyk');
	}

	// No cart, create one
	if (!cart) {
		const [, createCartError] = await trytm(createCart(sessionUser.id));

		if (createCartError) {
			throw error(500, 'Wystąpił błąd podczas tworzenia nowego koszyka');
		}

		throw error(400, 'Nie ma takiego produktu w koszyku');
	}

	// Remove the product from the cart
	const [, removeProductsError] = await trytm(deleteProduct(cart.id, cartProducts.productId));

	if (removeProductsError) {
		// Unexpected-error
		throw error(500, 'Wystąpił błąd podczas usuwania produktu z koszyka');
	}

	return { success: true };
};

export default removeFromCart;