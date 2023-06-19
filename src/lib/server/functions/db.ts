import type { z } from 'zod';
import { images, type createImageSchema } from '../db/schemas/images';
import { db } from '../db';
import { createOrderSchema, orders } from '../db/schemas/orders';
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
		productsQuantity: JSON.parse(order.productsQuantity?.toString() || 'null'),
		address: JSON.parse(order.address?.toString() || 'null')
	});
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
