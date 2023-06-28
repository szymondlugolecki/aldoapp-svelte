import type { z } from 'zod';
import { images, type createImageSchema } from '../db/schemas/images';
import { db } from '../db';
import { createOrderSchema, orderProducts, orders } from '../db/schemas/orders';
import { createProductSchema, products } from '../db/schemas/products';
import { users, type createUserSchema } from '../db/schemas/users';
import {
	verificationTokens,
	type createVerificationTokenSchema
} from '../db/schemas/verificationTokens';

export const addImage = (image: z.infer<typeof createImageSchema>) => {
	return db.insert(images).values(image);
};

export const addOrder = (order: z.infer<typeof createOrderSchema>) => {
	return db.insert(orders).values({
		...order,
		address: JSON.parse(order.address?.toString() || 'null')
	});
};

export const addOrderProducts = (
	orderProductsArr: { orderId: number; quantity: number; productId: number }[]
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
