import type { z } from 'zod';
import { images, type createImageSchema } from '../db/schemas/images';
import { db } from '../db';
import { createOrderSchema, orders, type Address } from '../db/schemas/orders';
import { createProductSchema, products } from '../db/schemas/products';
import { users, type createUserSchema } from '../db/schemas/users';
import {
	verificationTokens,
	type createVerificationTokenSchema
} from '../db/schemas/verificationTokens';
import { cartProducts as cartProductsTable } from '../db/schemas/cartProducts';
import { orderProducts } from '../db/schemas/orderProducts';
import { carts } from '../db/schemas/carts';
import { and, eq } from 'drizzle-orm';
import type { DeliveryMethod, PaymentMethod } from '$lib/client/constants/dbTypes';

export const addImage = (image: z.infer<typeof createImageSchema>) => {
	return db.insert(images).values(image);
};

interface AddOrder extends z.infer<typeof createOrderSchema> {
	address: Address;
}

export const addOrder = (order: AddOrder) => {
	order.address;
	return db.insert(orders).values({
		...order,
		address: order.address
	});
};

export const emptyCart = (cartId: number) => {
	return db.delete(cartProductsTable).where(eq(cartProductsTable.cartId, cartId));
};

export const resetCart = (cartId: number) => {
	return db.transaction(async (tx) => {
		await tx.delete(cartProductsTable).where(eq(cartProductsTable.cartId, cartId));
		await tx
			.update(carts)
			.set({
				customAddress: null
			})
			.where(eq(cartProductsTable.cartId, cartId));
	});
};

export const addOrderProducts = (
	orderProductsArr: { orderId: number; quantity: number; productId: number; price: string }[]
) => {
	return db.insert(orderProducts).values(orderProductsArr);
};

export const addProduct = (product: z.infer<typeof createProductSchema>) => {
	return db.insert(products).values(product);
};

export const addUser = (user: z.infer<typeof createUserSchema>) => {
	return db.insert(users).values(user);
};

export const addVerificationToken = (token: z.infer<typeof createVerificationTokenSchema>) => {
	return db.insert(verificationTokens).values(token);
};

export const addProductToCart = (
	cartId: number,
	products: {
		productId: number;
		quantity: number;
	}[]
) => {
	return db.transaction(async (tx) => {
		const cartProduct = await tx.query.cartProducts.findFirst({
			where: (cartProducts, { eq }) =>
				and(eq(cartProducts.cartId, cartId), eq(cartProducts.productId, products[0].productId))
		});

		if (cartProduct) {
			return await tx
				.update(cartProductsTable)
				.set({
					quantity: cartProduct.quantity + products[0].quantity
				})
				.where(eq(cartProductsTable.id, cartProduct.id));
		}

		return await tx.insert(cartProductsTable).values(
			products.map((product) => ({
				cartId,
				productId: product.productId,
				quantity: product.quantity
			}))
		);
	});
};

export const createCart = (ownerId: string) => {
	return db.insert(carts).values({
		ownerId,
		customerId: ownerId,
		deliveryMethod: 'personal-delivery',
		paymentMethod: 'cash'
	});
};

export const deleteProduct = (cartId: number, productId: number) => {
	return db
		.delete(cartProductsTable)
		.where(and(eq(cartProductsTable.cartId, cartId), eq(cartProductsTable.productId, productId)));
};

export const changePaymentMethod = (cartId: number, paymentMethod: PaymentMethod) => {
	return db
		.update(carts)
		.set({
			paymentMethod
		})
		.where(eq(carts.id, cartId));
};

export const changeDeliveryMethod = (
	cartId: number,
	deliveryMethod: DeliveryMethod,
	customAddress?: Address | null
) => {
	return db
		.update(carts)
		.set({
			deliveryMethod,
			customAddress
		})
		.where(eq(carts.id, cartId));
};

export const decrementProduct = (cartId: number, productId: number) => {
	return db.transaction(async (tx) => {
		const cartProduct = await tx.query.cartProducts.findFirst({
			where: (cartProducts, { eq }) =>
				and(eq(cartProducts.cartId, cartId), eq(cartProducts.productId, productId))
		});

		if (!cartProduct) {
			return;
		}

		if (cartProduct.quantity <= 1) {
			return await db.delete(cartProductsTable).where(eq(cartProductsTable.id, cartProduct.id));
		}

		return await db
			.update(cartProductsTable)
			.set({
				quantity: cartProduct.quantity - 1
			})
			.where(eq(cartProductsTable.id, cartProduct.id));
	});
};

/*
	(cartProducts, { and, eq }) =>
		and(eq(cartProducts.cartId, cartId), eq(cartProducts.productId, productId))

*/
