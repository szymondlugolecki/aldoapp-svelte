import getCustomError from '$lib/client/constants/customErrors';
// import { p } from '$lib/server/clients/pClient';
import { trytm } from '@bdsqqq/try';
import { error, fail, type Action, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schemas/orders';
import { eq } from 'drizzle-orm';
import { order$ } from '$lib/client/schemas';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { addProductsToCart } from '$lib/server/functions/db';
import { cartProducts } from '$lib/server/db/schemas/cartProducts';

/*

What it should do:
    @ Fetch the order from the database
    @ Take the order's products and add them to the cart
    @ Redirect to the cart page

*/

const orderAgain = (async (event) => {
	const sessionUser = event.locals.session?.user;
	if (!sessionUser) {
		throw error(...getCustomError('not-logged-in'));
	}

	const form = await superValidate(event, order$.orderAgainForm);
	if (!form.valid) {
		return fail(400, { form });
	}

	const { id } = form.data;

	const [order, getOrderError] = await trytm(
		db.query.orders.findFirst({
			where: eq(orders.id, id),
			columns: {
				id: true
			},
			with: {
				products: {
					columns: {
						quantity: true
					},
					with: {
						product: {
							columns: {
								id: true
							}
						}
					}
				}
			}
		})
	);
	if (getOrderError) {
		// Unexpected error
		console.error('getOrderError', getOrderError);
		throw error(500, 'Błąd podczas szukania zamówienia');
	}
	if (!order) {
		// Order not found
		return setError(form, 'id', 'Nie znaleziono zamówienia');
	}

	const [cart, getCartError] = await trytm(
		db.query.carts.findFirst({
			where: (carts) => eq(carts.ownerId, sessionUser.id),
			columns: {
				id: true
			}
		})
	);
	if (getCartError) {
		// Unexpected error
		console.error('getCartError', getCartError);
		throw error(500, 'Błąd podczas szukania Twojego koszyka');
	}
	if (!cart) {
		// Cart not found
		return setError(form, 'id', 'Nie znaleziono koszyka');
	}

	// Clear the cart
	const [, clearCartError] = await trytm(
		db.delete(cartProducts).where(eq(cartProducts.cartId, cart.id))
	);
	if (clearCartError) {
		// Unexpected error
		console.error('clearCartError', clearCartError);
		throw error(500, 'Błąd podczas opróżniania koszyka');
	}

	// Add products to the cart
	const [, addProductsError] = await trytm(
		addProductsToCart(
			cart.id,
			order.products.map(({ product, quantity }) => ({ id: product.id, quantity }))
		)
	);
	if (addProductsError) {
		return setError(form, 'id', 'Błąd podczas dodawania produktów do koszyka');
	}

	throw redirect(301, '/koszyk');
}) satisfies Action;

export default orderAgain;
