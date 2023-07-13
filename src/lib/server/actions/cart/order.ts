import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { error, type Action, fail, redirect } from '@sveltejs/kit';
import { addOrder, addOrderProducts, resetCart } from '$lib/server/functions/db';

// What it should do:
/*

 @ Create an order from the cart
 @ Create order products from the cart products
 @ Empty the cart
 @ Redirect to the order page

*/
const createOrder: Action = async ({ locals }) => {
	const sessionUser = locals.session?.user;

	if (!sessionUser) {
		throw error(401, 'Nie jesteś zalogowany');
	}

	// Check if user has a cart
	const [preFormatCart, fetchCartError] = await trytm(
		db.query.carts.findFirst({
			where: (carts, { eq }) => eq(carts.ownerId, sessionUser.id),
			with: {
				products: {
					columns: {
						quantity: true
					},
					with: {
						product: {
							columns: {
								id: true,
								name: true,
								price: true,
								symbol: true,
								encodedURL: true
							}
						}
					}
				},
				customer: {
					columns: {
						address: true
					}
				}
			}
		})
	);

	if (fetchCartError) {
		return fail(500, {
			errors: ['Wystąpił błąd podczas sprawdzania czy istnieje koszyk']
		});
	}

	// No cart
	if (!preFormatCart) {
		return fail(400, {
			errors: ['Nie można złożyć zamówienia, ponieważ koszyk nie istnieje']
		});
	}

	const cart = {
		...preFormatCart,
		products: preFormatCart.products.map(({ product, quantity }) => ({
			...product,
			quantity
		}))
	};

	const address = cart.customAddress || cart.customer.address;

	if (!address) {
		return fail(400, {
			errors: ['Błąd, brak adresu. Podaj adres przy zamówieniu lub dodaj go w ustawieniach konta']
		});
	}

	const noDiscountPrice = cart.products
		.map(({ price, quantity }) => [price, quantity])
		.reduce((prev, [price, quantity]) => prev + Number(price) * Number(quantity), 0);
	const discount = 0;
	const price = noDiscountPrice - discount;

	const orderObj: Parameters<typeof addOrder>[0] = {
		noDiscountPrice: noDiscountPrice.toString(),
		price: price.toString(),
		discount: discount.toString(),
		deliveryMethod: cart.deliveryMethod,
		paymentMethod: cart.paymentMethod,
		status: 'pending',
		paymentStatus: 'pending',
		deliveryStatus: 'pending',
		customerId: cart.customerId,
		cartOwnerId: cart.ownerId,
		address
	};

	// Create the order
	const [createOrderQuery, createOrderError] = await trytm(addOrder(orderObj));

	if (createOrderError) {
		// Unexpected-error
		console.log('createOrderError', createOrderError);
		return fail(500, {
			errors: ['Wystąpił błąd podczas składania zamówienia']
		});
	}

	const orderId = Number(createOrderQuery.insertId);

	// Add products to the order
	const [, addProductsToOrderError] = await trytm(
		addOrderProducts(
			cart.products.map(({ id, quantity, price }) => ({ orderId, quantity, productId: id, price }))
		)
	);
	if (addProductsToOrderError) {
		// Unexpected-error
		console.log('addProductsToOrderError', addProductsToOrderError);
		return fail(500, {
			errors: [
				'Niespodziewany błąd. Utworzono zamówienie, ale nie udało się zapisać zamówionych produktów. Skontaktuj się z administracją.'
			]
		});
	}

	// Empty the cart and set the custom address to null
	const [, resetCartError] = await trytm(resetCart(cart.id));
	if (resetCartError) {
		// Unexpected-error
		console.log('resetCartError', resetCartError);
		// order created, products added, but cart not reset
		// no reason to throw an error
	}

	throw redirect(303, `/zamowienia/${orderId}?success=true`);
};

export default createOrder;
