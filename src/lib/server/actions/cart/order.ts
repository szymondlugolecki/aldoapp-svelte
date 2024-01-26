import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { error, type Action, fail, redirect } from '@sveltejs/kit';
import { createNewOrder } from '$lib/server/functions/db';
import getCustomError from '$lib/client/constants/customErrors';
import type { createOrderSchema } from '$lib/server/db/schemas/orders';
import type { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { order$ } from '$lib/client/schemas';

const createOrder: Action = async (event) => {
	const sessionUser = event.locals.session?.user;
	if (!sessionUser) {
		error(...getCustomError('not-logged-in'));
	}

	const form = await superValidate(event, order$.create);
	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	// Fetch users cart for products
	const [cart, fetchCartError] = await trytm(
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
		error(500, 'Błąd podczas pobierania produktów z koszyka');
	}

	// No cart
	if (!cart) {
		// Unexpected-error
		console.error('No cart found for unknown reason', sessionUser);
		error(500, 'Nie znaleziono koszyka');
	}

	const productsWithQuantity = cart.products.map(({ product, quantity }) => ({
		...product,
		quantity
	}));

	const price = productsWithQuantity
		.map(({ price, quantity }) => [price, quantity])
		.reduce((prev, [price, quantity]) => prev + Number(price) * Number(quantity), 0);

	const order = {
		price: price.toString(),
		createdAt: new Date(),
		discount: '0',
		deliveryMethod: form.data.deliveryMethod,
		paymentMethod: form.data.paymentMethod,
		status: 'awaitingOffice',
		customerId: cart.customerId,
		cartOwnerId: cart.ownerId
	} satisfies z.infer<typeof createOrderSchema>;

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
	const [newOrderId, createOrderError] = await trytm(
		createNewOrder({
			order,
			productsWithoutOrderId: orderProducts,
			cartId: cart.id,
			address: cart.customer.address,
			// {
			// 	city: form.data.city,
			// 	street: form.data.street,
			// 	zipCode: form.data.zipCode
			// },
			// saveAddress: form.data.saveAddress,
			cartOwner: cart.owner,
			customer: cart.customer,
			productsForEmailSummary
		})
	);

	if (createOrderError) {
		// Unexpected-error
		console.log('createOrderError', createOrderError);
		return setError(form, 'Błąd podczas składania zamówienia', { status: 500 });
	}

	redirect(303, `/zamowienia/${newOrderId}?success=true`);
};

export default createOrder;
