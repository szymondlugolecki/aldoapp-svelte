// import { p } from '$lib/server/clients/pClient';
import { trytm } from '@bdsqqq/try';
import { fail, type Action, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { ordersTable } from '$lib/server/db/schemas/orders';
import { eq } from 'drizzle-orm';
import { order$ } from '$lib/client/schemas';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { addProductsToCart } from '$lib/server/functions/db';
import { cartProductsTable } from '$lib/server/db/schemas/cartProducts';

/*

What it should do:
    @ Fetch the order from the database
    @ Take the order's products and add them to the cart
    @ Redirect to the cart page

*/

const orderAgain = (async (event) => {
	const sessionUser = event.locals.user;
	if (!sessionUser) {
		redirect(303, '/zaloguj');
		// error(...getCustomError('not-logged-in'));;
	}

	const form = await superValidate(event, order$.orderAgainForm);
	if (!form.valid) {
		return fail(400, { form });
	}

	const { id } = form.data;

	const [order, getOrderError] = await trytm(
		db.query.ordersTable.findFirst({
			where: eq(ordersTable.id, id),
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
		return setError(form, 'Błąd serwera podczas szukania zamówienia', { status: 500 });
	}
	if (!order) {
		// Order not found
		return setError(form, 'Nie znaleziono zamówienia', { status: 400 });
	}

	const [cart, getCartError] = await trytm(
		db.query.cartsTable.findFirst({
			where: (carts) => eq(carts.ownerId, sessionUser.id),
			columns: {
				id: true
			}
		})
	);
	if (getCartError) {
		// Unexpected error
		console.error('getCartError', getCartError);
		return setError(form, 'Błąd serwera podczas szukania koszyka', { status: 500 });
	}
	if (!cart) {
		// Cart not found
		return setError(form, 'Nie znaleziono koszyka', { status: 400 });
	}

	// Clear the cart
	const [, clearCartError] = await trytm(
		db.delete(cartProductsTable).where(eq(cartProductsTable.cartId, cart.id))
	);
	if (clearCartError) {
		// Unexpected error
		console.error('clearCartError', clearCartError);
		return setError(form, 'Błąd serwera podczas opróżniania koszyka', { status: 500 });
	}

	// Add products to the cart
	const [, addProductsError] = await trytm(
		addProductsToCart(
			cart.id,
			order.products.map(({ product, quantity }) => ({ id: product.id, quantity }))
		)
	);
	if (addProductsError) {
		return setError(form, 'Błąd serwera podczas dodawania produktów do koszyka', { status: 500 });
	}

	redirect(301, '/koszyk');
}) satisfies Action;

export default orderAgain;
