import { trytm } from '@bdsqqq/try';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { changeProductQuantityRequestSchema } from '$lib/client/schemas/cart';
import { db } from '$lib/server/db';
import { addProductToCart, createCart } from '$lib/server/functions/db';
import { error, type Action, fail } from '@sveltejs/kit';

// add one product to cart
const addToCart: Action = async ({ request, locals }) => {
	const sessionUser = locals.session?.user;

	if (!sessionUser) {
		throw error(401, 'Nie jesteś zalogowany');
	}

	// Validate the user input
	const [formData, formDataError] = await trytm(request.formData());
	console.log('addToCart', 'formData', formData);
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

	console.log('addToCart', 'data', data);

	// Validate the request body
	const [cartProducts, parseError] = betterZodParse(changeProductQuantityRequestSchema, data);
	if (parseError) {
		console.error('Failed to validate the add product to cart request body', parseError);
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

	console.log('User cart', cart);

	let cartId = cart?.id;

	// No cart, create one
	if (!cart) {
		const [createdCart, createCartError] = await trytm(createCart(sessionUser.id));

		if (createCartError) {
			return fail(500, {
				errors: ['Wystąpił błąd podczas tworzenia nowego koszyka']
			});
		}

		cartId = Number(createdCart.insertId);
	}

	if (!cartId || isNaN(cartId)) {
		// Unexpected-error
		return fail(500, {
			errors: ['Wystąpił błąd podczas tworzenia nowego koszyka']
		});
	}

	// Add products to the cart
	const [, addProductsError] = await trytm(
		addProductToCart(cartId, [
			{
				productId: cartProducts.productId,
				quantity: 1
			}
		])
	);

	if (addProductsError) {
		// Unexpected-error
		return fail(500, {
			errors: ['Wystąpił błąd podczas dodawania produktów do koszyka']
		});
	}

	return { success: true };
};

export default addToCart;
