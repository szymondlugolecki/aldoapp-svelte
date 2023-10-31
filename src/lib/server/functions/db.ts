import type { z } from 'zod';
import { db } from '../db';
import { createOrderSchema, orders, type Address } from '../db/schemas/orders';
import { createProductSchema, products } from '../db/schemas/products';
import { users, type createUserSchema, type User } from '../db/schemas/users';
import {
	verificationTokens,
	type createVerificationTokenSchema
} from '../db/schemas/verificationTokens';
import { cartProducts as cartProductsTable } from '../db/schemas/cartProducts';
import { orderProducts } from '../db/schemas/orderProducts';
import { carts } from '../db/schemas/carts';
import { and, eq } from 'drizzle-orm';
import { userAddress } from '../db/schemas/userAddress';
import { sendNotifications } from './push';
import { getPushMessage } from '../constants/messages';
import { orderAddress } from '../db/schemas/orderAddress';
import { sendOrderCreatedEmail } from '../clients/resend';

type CreateOrderProduct = { orderId: number; quantity: number; productId: number; price: string };

// export const addImage = (image: z.infer<typeof createImageSchema>) => {
// 	return db.transaction(async (tx) => {
// 		const orderId = (await db.insert(images).values(image)).insertId
// 		const orderProductsId = (await tx.insert(orderProducts).values(orderProductsArr)).insertId
// 	})
// };

interface CreateOrderParams {
	order: z.infer<typeof createOrderSchema>;
	productsWithoutOrderId: Omit<CreateOrderProduct, 'orderId'>[];
	cartId: number;
	address: Address;
	saveAddress?: boolean;
	cartOwner: Pick<User, 'id' | 'email' | 'fullName' | 'phone'>;
	customer: Pick<User, 'id' | 'email' | 'fullName' | 'phone'>;
}

export const createNewOrder = ({
	address,
	cartId,
	order,
	productsWithoutOrderId,
	saveAddress,
	cartOwner,
	customer
}: CreateOrderParams) => {
	return db.transaction(async (tx) => {
		// Create the order & add products && add order address
		const orderIdStr = (await tx.insert(orders).values([order])).insertId;
		const orderId = Number(orderIdStr);
		const products = productsWithoutOrderId.map((product) => ({ ...product, orderId }));

		await tx.transaction(async (tx) => {
			await tx.insert(orderProducts).values(products);
			await tx.insert(orderAddress).values([{ ...address, orderId }]);

			// Save address
			if (saveAddress) {
				await tx.insert(userAddress).values([{ ...address, userId: order.customerId }]);
			}
		});

		// Clear the cart
		await tx.transaction(async (tx) => {
			await tx.delete(cartProductsTable).where(eq(cartProductsTable.cartId, cartId));
		});

		// Send PUSH notifications
		await tx.transaction(async (tx) => {
			const subscription = await tx.query.subscriptions.findFirst({
				columns: {
					endpoint: true,
					expirationTime: true,
					keys: true
				},
				where: (subscription, { eq }) => eq(subscription.userId, order.customerId)
			});

			if (!subscription) {
				return;
			}

			// PUSH notification logic
			// ...
			sendNotifications([subscription], getPushMessage('order-created'));
		});

		// Send email
		await tx.transaction(async () => {
			const orderDate = order.createdAt.toLocaleString('pl-PL', {
				timeZone: 'Europe/Warsaw',
				month: 'long',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				year: 'numeric'
			});

			//  Email sending logic
			await sendOrderCreatedEmail({
				to: [customer.email],
				props: {
					orderId,
					time: orderDate,
					price: order.price,
					firstName: customer.fullName.split(' ')[0],
					cartOwner
				}
			});
		});

		return orderId;
	});
};

export const emptyCart = (cartId: number) => {
	return db.delete(cartProductsTable).where(eq(cartProductsTable.cartId, cartId));
};

export const resetCart = (cartId: number) => {
	return db.transaction(async (tx) => {
		await tx.delete(cartProductsTable).where(eq(cartProductsTable.cartId, cartId));
	});
};

export const addProduct = (product: z.infer<typeof createProductSchema>) => {
	return db.insert(products).values(product);
};

export const addUser = (user: z.infer<typeof createUserSchema>) => {
	return db.transaction(async (tx) => {
		const userId = (await tx.insert(users).values(user)).insertId;
		const cartId = (
			await tx.insert(carts).values({
				ownerId: user.id,
				customerId: user.id,
				createdAt: new Date()
			})
		).insertId;
		const addressId = (
			await tx.insert(userAddress).values({
				city: '',
				street: '',
				zipCode: '',
				userId: user.id
			})
		).insertId;

		return {
			userId,
			cartId,
			addressId
		};
	});
};

export const addVerificationToken = (token: z.infer<typeof createVerificationTokenSchema>) => {
	return db.insert(verificationTokens).values(token);
};

export const createCart = (ownerId: string) => {
	return db.insert(carts).values({
		ownerId,
		customerId: ownerId,
		createdAt: new Date()
	});
};

export const deleteProduct = (cartId: number, productId: number) => {
	return db
		.delete(cartProductsTable)
		.where(and(eq(cartProductsTable.cartId, cartId), eq(cartProductsTable.productId, productId)));
};

export const changeCartCustomer = (cartId: number, customerId: string) => {
	return db
		.update(carts)
		.set({
			customerId
		})
		.where(eq(carts.id, cartId));
};

export const addProductsToCart = (cartId: number, products: { quantity: number; id: number }[]) => {
	return db.transaction(async (tx) => {
		const cartProducts = products.map((product) => ({
			productId: product.id,
			cartId,
			quantity: product.quantity
		}));

		console.log('adding products', cartProducts);

		return await tx.insert(cartProductsTable).values(cartProducts);
	});
};

export const setCartProductQuantity = (cartId: number, productId: number, quantity: number) => {
	return db.transaction(async (tx) => {
		// If quantity is 0, delete the product
		if (!quantity) {
			return await tx
				.delete(cartProductsTable)
				.where(
					and(eq(cartProductsTable.cartId, cartId), eq(cartProductsTable.productId, productId))
				);
		}

		// If quantity is positive
		const productExists = await tx.query.cartProducts.findFirst({
			where: (cartProducts, { eq }) =>
				and(eq(cartProducts.cartId, cartId), eq(cartProducts.productId, productId))
		});

		// If product exists, update the quantity
		if (productExists) {
			return await tx
				.update(cartProductsTable)
				.set({
					quantity
				})
				.where(eq(cartProductsTable.id, productExists.id));
		}
		// Doesnt exist, create a new one
		// (useful for adding products to cart)
		else {
			return await tx.insert(cartProductsTable).values({
				cartId,
				productId,
				quantity
			});
		}
	});
};

export const createUser = (user: z.infer<typeof createUserSchema>) => {
	return db.transaction(async (tx) => {
		await tx.insert(users).values(user);
		await tx.insert(carts).values({
			ownerId: user.id,
			customerId: user.id,
			createdAt: new Date()
		});
		await tx.insert(userAddress).values({
			city: '',
			street: '',
			zipCode: '',
			userId: user.id
		});
	});
};
