import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { type Action, fail, redirect } from '@sveltejs/kit';
import { createNewOrder } from '$lib/server/functions/db';
import type { InsertOrder } from '$lib/server/db/schemas/orders';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { order$ } from '$lib/client/schemas';
import { generateId } from 'lucia';

const createOrder: Action = async ({ locals, request }) => {
	const sessionUser = locals.user;
	if (!sessionUser) {
		redirect(303, '/zaloguj');
		// error(...getCustomError('not-logged-in'));;
	}

	const form = await superValidate(request, order$.create);
	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	// Fetch users cart for products
	const [cart, fetchCartError] = await trytm(
		db.query.cartsTable.findFirst({
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
								encodedURL: true,
								image: true
							}
						}
					}
				},
				customer: {
					with: {
						address: {
							columns: {
								city: true,
								street: true,
								zipCode: true
							}
						}
					}
				},
				owner: {
					columns: {
						id: true,
						fullName: true,
						email: true,
						phone: true
					}
				}
			}
		})
	);

	if (fetchCartError) {
		// Unexpected-error
		console.error('fetchCartError', fetchCartError);
		return setError(form, 'Błąd serwera podczas pobierania produktów z koszyka', { status: 500 });
	}

	// No cart
	if (!cart) {
		// Unexpected-error
		console.error('No cart found for unknown reason', sessionUser);
		return setError(form, 'Twój koszyk nie istnieje. Skontaktuj się z administratorem', {
			status: 500
		});
	}

	const productsWithQuantity = cart.products.map(({ product, quantity }) => ({
		...product,
		quantity
	}));

	const price = productsWithQuantity
		.map(({ price, quantity }) => [price, quantity])
		.reduce((prev, [price, quantity]) => prev + Number(price) * Number(quantity), 0);

	const orderId = generateId(5);

	const order = {
		id: orderId,
		price: price,
		createdAt: new Date(),
		deliveryMethod: form.data.deliveryMethod,
		paymentMethod: form.data.paymentMethod,
		status: 'awaitingOffice',
		customerId: cart.customerId,
		cartOwnerId: cart.ownerId,
		discount: 0
	} satisfies InsertOrder;

	const orderProducts = productsWithQuantity.map(({ id, quantity, price }) => ({
		quantity,
		productId: id,
		price
	}));

	const productsForEmailSummary = productsWithQuantity.map(
		({ id, quantity, price, name, symbol, encodedURL, image }) => ({
			id,
			quantity,
			price,
			name,
			symbol,
			encodedURL,
			image
		})
	);

	// Create the order
	const [, createOrderError] = await trytm(
		createNewOrder({
			order,
			productsWithoutOrderId: orderProducts,
			cartId: cart.id,
			address: cart.customer.address,
			cartOwner: cart.owner,
			customer: cart.customer,
			productsForEmailSummary
		})
	);
	if (createOrderError) {
		// Unexpected-error
		console.log('createOrderError', createOrderError);
		return setError(
			form,
			'Błąd serwera podczas składania zamówienia. Spróbuj ponownie później lub skontaktuj się z administratorem',
			{ status: 500 }
		);
	}

	redirect(303, `/zamowienia/${orderId}?success=true`);
};

export default createOrder;
