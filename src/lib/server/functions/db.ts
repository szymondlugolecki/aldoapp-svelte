import { db } from '../db';
import { ordersTable, type Address, type InsertOrder } from '../db/schemas/orders';
import { productsTable, type InsertProduct, type SelectProduct } from '../db/schemas/products';
import { usersTable, type SelectUser, type InsertUser } from '../db/schemas/users';
import { cartProductsTable } from '../db/schemas/cartProducts';
import { orderProductsTable } from '../db/schemas/orderProducts';
import { cartsTable, type SelectCart } from '../db/schemas/carts';
import { and, eq } from 'drizzle-orm';
import { userAddressTable } from '../db/schemas/userAddress';
import { sendNotifications } from './push';
import { getPushMessage } from '../constants/messages';
import { orderAddressTable } from '../db/schemas/orderAddress';
import { sendOrderCreatedEmail } from '../clients/resend';
import type { OrderProduct } from '$types';
import { orderStatusLogsTable } from '../db/schemas/orderStatusLogs';
import {
	verificationTokensTable,
	type InsertVerificationToken
} from '../db/schemas/verificationTokens';

type CreateOrderProduct = { orderId: string; quantity: number; productId: number; price: number };

// export const addImage = (image: z.infer<typeof createImageSchema>) => {
// 	return db.transaction(async (tx) => {
// 		const orderId = (await db.insert(images).values(image)).insertId
// 		const orderProductsId = (await tx.insert(orderProducts).values(orderProductsArr)).insertId
// 	})
// };

interface CreateOrderParams {
	order: InsertOrder;
	cartId: number;
	cartOwner: Pick<SelectUser, 'id' | 'email' | 'fullName' | 'phone'>;
	customer: Pick<SelectUser, 'id' | 'email' | 'fullName' | 'phone'>;
	productsWithoutOrderId: Omit<CreateOrderProduct, 'orderId'>[];
	productsForEmailSummary: (OrderProduct & { quantity: number; image: string | null })[];
	address: Address;
}

export const createNewOrder = async ({
	cartId,
	order,
	productsWithoutOrderId,
	cartOwner,
	customer,
	productsForEmailSummary,
	address
}: CreateOrderParams) => {
	const products = productsWithoutOrderId.map((product) => ({
		...product,
		orderId: order.id,
		price: Number(product.price)
	}));

	const batchResponse = await db.batch([
		db
			.insert(ordersTable)
			.values([order] as [InsertOrder])
			.returning({ createdAt: ordersTable.createdAt }),
		db.insert(orderProductsTable).values(products),
		db.insert(orderAddressTable).values([{ ...address, orderId: order.id }]),
		db.insert(orderStatusLogsTable).values([
			{
				orderId: order.id,
				event: 'CREATED',
				userId: cartOwner.id,
				createdAt: new Date()
			}
		]),
		db.delete(cartProductsTable).where(eq(cartProductsTable.cartId, cartId)),
		db
			.update(cartsTable)
			.set({
				customerId: cartOwner.id
			})
			.where(eq(cartsTable.id, cartId)),
		db.query.subscriptionsTable.findFirst({
			columns: {
				endpoint: true,
				expirationTime: true,
				keys: true
			},
			where: (sub, { eq }) => eq(sub.userId, order.customerId)
		})
	]);

	const subscription = batchResponse[6];
	if (!subscription) {
		return;
	}
	sendNotifications([subscription], getPushMessage('order-created'));

	const { createdAt } = batchResponse[0][0];
	const orderDate = createdAt.toLocaleString('pl-PL', {
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
			orderId: order.id,
			time: orderDate,
			price: order.price,
			firstName: customer.fullName.split(' ')[0],
			cartOwner,
			products: productsForEmailSummary
		}
	});

	// return db.transaction(async (tx) => {
	// 	// Create the order & add products && add order address
	// 	const [insertOrder, insertOrderError] = await trytm(
	// 		tx
	// 			.insert(ordersTable)
	// 			.values([order] as [InsertOrder])
	// 			.returning()
	// 	);
	// 	const createdOrder = insertOrder ? insertOrder[0] : null;
	// 	const orderId = createdOrder?.id;

	// 	if (insertOrderError || !createdOrder || !orderId) {
	// 		// Unexpected-error
	// 		console.error('insertOrderError', insertOrderError || 'Brak zamówienia po utworzeniu?');
	// 		tx.rollback();
	// 		return 'Nie udało się utworzyć zamówienia';
	// 	}

	// 	const products = productsWithoutOrderId.map((product) => ({
	// 		...product,
	// 		orderId,
	// 		price: Number(product.price)
	// 	}));

	// 	const [, error] = await trytm(
	// 		Promise.all([
	// 			tx.insert(orderProductsTable).values(products),
	// 			tx.insert(orderAddressTable).values([{ ...address, orderId }]),
	// 			tx.insert(orderStatusLogsTable).values([
	// 				{
	// 					orderId,
	// 					event: 'CREATED',
	// 					userId: cartOwner.id,
	// 					createdAt: new Date()
	// 				}
	// 			])
	// 		])
	// 	);

	// 	if (error) {
	// 		// Unexpected-error
	// 		console.error('createNewOrder error @ Promise.all', error);
	// 		tx.rollback();
	// 		return 'Błąd podczas tworzenia zamówienia';
	// 	}

	// 	// 	Save address
	// 	// await tx.transaction(async (tx) => {
	// 	// 	if (saveAddress) {
	// 	// 		await tx.insert(userAddress).values([{ ...address, userId: order.customerId }]);
	// 	// 	}
	// 	// });

	// 	// Clear the cart
	// 	await tx.transaction(async (tx) => {
	// 		await tx.delete(cartProductsTable).where(eq(cartProductsTable.cartId, cartId));
	// 		console.log('removing the customer', cartId);
	// 		await tx
	// 			.update(cartsTable)
	// 			.set({
	// 				customerId: cartOwner.id
	// 			})
	// 			.where(eq(cartsTable.id, cartId));
	// 	});

	// 	// Send PUSH notifications
	// 	await tx.transaction(async (tx) => {
	// 		const subscription = await tx.query.subscriptionsTable.findFirst({
	// 			columns: {
	// 				endpoint: true,
	// 				expirationTime: true,
	// 				keys: true
	// 			},
	// 			where: (sub, { eq }) => eq(sub.userId, order.customerId)
	// 		});

	// 		if (!subscription) {
	// 			return;
	// 		}

	// 		// PUSH notification logic
	// 		// ...
	// 		sendNotifications([subscription], getPushMessage('order-created'));
	// 	});

	// 	// Send email
	// 	await tx.transaction(async () => {
	// 		const orderDate = createdOrder.createdAt.toLocaleString('pl-PL', {
	// 			timeZone: 'Europe/Warsaw',
	// 			month: 'long',
	// 			day: '2-digit',
	// 			hour: '2-digit',
	// 			minute: '2-digit',
	// 			year: 'numeric'
	// 		});

	// 		//  Email sending logic
	// 		await sendOrderCreatedEmail({
	// 			to: [customer.email],
	// 			props: {
	// 				orderId,
	// 				time: orderDate,
	// 				price: order.price,
	// 				firstName: customer.fullName.split(' ')[0],
	// 				cartOwner,
	// 				products: productsForEmailSummary
	// 			}
	// 		});
	// 	});

	// 	return orderId;
	// });
};

export const emptyCart = (cartId: number) => {
	return db.delete(cartProductsTable).where(eq(cartProductsTable.cartId, cartId));
};

export const resetCart = (cartId: number) => {
	return db.transaction(async (tx) => {
		await tx.delete(cartProductsTable).where(eq(cartProductsTable.cartId, cartId));
	});
};

export const createProduct = (product: InsertProduct) => {
	return db.insert(productsTable).values(product);
};

export const createUser = (user: InsertUser) => {
	return db.batch([
		db.insert(usersTable).values(user),
		db.insert(cartsTable).values({
			ownerId: user.id,
			customerId: user.id,
			createdAt: new Date()
		}),
		db.insert(userAddressTable).values({
			city: '',
			street: '',
			zipCode: '',
			userId: user.id
		})
	]);
};

export const createCart = (ownerId: SelectUser['id']) => {
	return db.insert(cartsTable).values({
		ownerId,
		customerId: ownerId,
		createdAt: new Date()
	});
};

export const deleteProduct = (cartId: SelectCart['id'], productId: SelectProduct['id']) => {
	return db
		.delete(cartProductsTable)
		.where(and(eq(cartProductsTable.cartId, cartId), eq(cartProductsTable.productId, productId)));
};

export const changeCartCustomer = (cartId: SelectCart['id'], customerId: SelectUser['id']) => {
	return db
		.update(cartsTable)
		.set({
			customerId
		})
		.where(eq(cartsTable.id, cartId));
};

export const addProductsToCart = (
	cartId: SelectCart['id'],
	products: { quantity: number; id: number }[]
) => {
	const cartProducts = products.map((product) => ({
		productId: product.id,
		cartId,
		quantity: product.quantity
	}));

	return db.insert(cartProductsTable).values(cartProducts);
};

export const setCartProductQuantity = (cartId: number, productId: number, quantity: number) => {
	return db.transaction(async (tx) => {
		console.log('setCartProductQuantity', 0);
		// If quantity is 0, delete the product
		if (!quantity) {
			return await tx
				.delete(cartProductsTable)
				.where(
					and(eq(cartProductsTable.cartId, cartId), eq(cartProductsTable.productId, productId))
				);
		}
		console.log('setCartProductQuantity', 1);

		// If quantity is positive
		// Assume the product does not exist, and insert it
		// return await tx
		// 	.insert(cartProductsTable)
		// 	.values({
		// 		cartId,
		// 		productId,
		// 		quantity
		// 	})
		// 	// If it exists, update the quantity
		// 	.onConflictDoUpdate({
		// 		target: [cartProductsTable.cartId, cartProductsTable.productId],
		// 		set: {
		// 			quantity
		// 		}
		// 	});

		const cartProduct = await tx.query.cartProductsTable.findFirst({
			where: (cartProducts, { eq }) =>
				and(eq(cartProducts.cartId, cartId), eq(cartProducts.productId, productId))
		});

		// If product exists, update the quantity
		if (cartProduct) {
			return await tx
				.update(cartProductsTable)
				.set({
					quantity
				})
				.where(eq(cartProductsTable.id, cartProduct.id));
		}

		console.log('setCartProductQuantity', 2);
		// Doesnt exist, create a new one
		// (when adding products to cart)
		return await tx.insert(cartProductsTable).values([
			{
				cartId,
				productId,
				quantity
			}
		]);
	});
};

export const addVerificationToken = (token: InsertVerificationToken) => {
	return db.insert(verificationTokensTable).values(token);
};
