import { db } from '../db';
import { orders, type Address, type InsertOrder } from '../db/schemas/orders';
import { products, type InsertProduct, type SelectProduct } from '../db/schemas/products';
import { users, type SelectUser, type InsertUser } from '../db/schemas/users';
import { verificationTokens, type InsertVerificationToken } from '../db/schemas/verificationTokens';
import { cartProducts as cartProductsTable } from '../db/schemas/cartProducts';
import { orderProducts } from '../db/schemas/orderProducts';
import { carts, type SelectCart } from '../db/schemas/carts';
import { and, eq } from 'drizzle-orm';
import { userAddress } from '../db/schemas/userAddress';
import { sendNotifications } from './push';
import { getPushMessage } from '../constants/messages';
import { orderAddress } from '../db/schemas/orderAddress';
import { sendOrderCreatedEmail } from '../clients/resend';
import type { OrderProduct } from '$types';
import { orderStatusLogs } from '../db/schemas/orderStatusLogs';
import { trytm } from '@bdsqqq/try';

type CreateOrderProduct = { orderId: number; quantity: number; productId: number; price: string };

// export const addImage = (image: z.infer<typeof createImageSchema>) => {
// 	return db.transaction(async (tx) => {
// 		const orderId = (await db.insert(images).values(image)).insertId
// 		const orderProductsId = (await tx.insert(orderProducts).values(orderProductsArr)).insertId
// 	})
// };

interface CreateOrderParams {
	order: InsertOrder;
	productsWithoutOrderId: Omit<CreateOrderProduct, 'orderId'>[];
	cartId: number;
	address: Address;
	saveAddress?: boolean;
	cartOwner: Pick<SelectUser, 'id' | 'email' | 'fullName' | 'phone'>;
	customer: Pick<SelectUser, 'id' | 'email' | 'fullName' | 'phone'>;
	productsForEmailSummary: (OrderProduct & { quantity: number; image: string | null })[];
}

export const createNewOrder = ({
	address,
	cartId,
	order,
	productsWithoutOrderId,
	cartOwner,
	customer,
	productsForEmailSummary
}: CreateOrderParams) => {
	return db.transaction(async (tx) => {
		// Create the order & add products && add order address
		const [insertOrder, insertOrderError] = await trytm(
			tx
				.insert(orders)
				.values([order] as [InsertOrder])
				.returning()
		);
		const createdOrder = insertOrder ? insertOrder[0] : null;
		const orderId = createdOrder?.id;

		if (insertOrderError || !createdOrder || !orderId) {
			// Unexpected-error
			console.error('insertOrderError', insertOrderError || 'Brak zamówienia po utworzeniu?');
			tx.rollback();
			return 'Nie udało się utworzyć zamówienia';
		}

		const products = productsWithoutOrderId.map((product) => ({
			...product,
			orderId,
			price: Number(product.price)
		}));

		const [, error] = await trytm(
			Promise.all([
				tx.insert(orderProducts).values(products),
				tx.insert(orderAddress).values([{ ...address, orderId }]),
				tx.insert(orderStatusLogs).values([
					{
						orderId,
						event: 'CREATED',
						userId: cartOwner.id,
						createdAt: new Date()
					}
				])
			])
		);

		if (error) {
			// Unexpected-error
			console.error('createNewOrder error @ Promise.all', error);
			tx.rollback();
			return 'Błąd podczas tworzenia zamówienia';
		}

		// 	Save address
		// await tx.transaction(async (tx) => {
		// 	if (saveAddress) {
		// 		await tx.insert(userAddress).values([{ ...address, userId: order.customerId }]);
		// 	}
		// });

		// Clear the cart
		await tx.transaction(async (tx) => {
			await tx.delete(cartProductsTable).where(eq(cartProductsTable.cartId, cartId));
			console.log('removing the customer', cartId);
			await tx
				.update(carts)
				.set({
					customerId: cartOwner.id
				})
				.where(eq(carts.id, cartId));
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
			const orderDate = createdOrder.createdAt.toLocaleString('pl-PL', {
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
					cartOwner,
					products: productsForEmailSummary
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

export const addProduct = (product: InsertProduct) => {
	return db.insert(products).values(product);
};

export const addUser = (user: SelectUser) => {
	return db.transaction(async (tx) => {
		const userId = (await tx.insert(users).values(user)).lastInsertRowid;
		const cartId = (
			await tx.insert(carts).values({
				ownerId: user.id,
				customerId: user.id,
				createdAt: new Date()
			})
		).lastInsertRowid;
		const addressId = (
			await tx.insert(userAddress).values({
				city: '',
				street: '',
				zipCode: '',
				userId: user.id
			})
		).lastInsertRowid;

		return {
			userId,
			cartId,
			addressId
		};
	});
};

export const addVerificationToken = (token: InsertVerificationToken) => {
	return db.insert(verificationTokens).values(token);
};

export const createCart = (ownerId: SelectUser['id']) => {
	return db.insert(carts).values({
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
		.update(carts)
		.set({
			customerId
		})
		.where(eq(carts.id, cartId));
};

export const addProductsToCart = (
	cartId: SelectCart['id'],
	products: { quantity: number; id: number }[]
) => {
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

export const createUser = (user: InsertUser) => {
	return db.transaction(async (tx) => {
		const [insertUser, insertUserError] = await trytm(tx.insert(users).values(user).returning());
		const createdUser = insertUser ? insertUser[0] : null;
		if (insertUserError || !createdUser) {
			// Unexpected-error
			console.error('insertUserError', insertUserError || 'Brak użytkownika po utworzeniu?');
			return {
				status: 'error',
				message: 'Błąd podczas tworzenia użytkownika'
			};
		}
		await tx.insert(carts).values([
			{
				ownerId: createdUser.id,
				customerId: createdUser.id
			}
		]);
		await tx.insert(userAddress).values([
			{
				city: '',
				street: '',
				zipCode: '',
				userId: createdUser.id
			}
		]);
	});
};
