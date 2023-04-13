import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { serverOrderValidation } from '$lib/client/schemas/order';
import { sendOrderConfirmationEmail } from '$lib/server/clients/sendGridClient';
// import { p } from '$lib/server/clients/pClient';
import { db } from '$lib/server/db';
import {
	orders,
	products,
	type Order,
	type OrderHistoryEvent
} from '$lib/server/db/schemas/products';
import { promoCodes, promoCodeUsages } from '$lib/server/db/schemas/promoCodes';
// import { sleep } from '$lib/server/functions/utils';
import type { PromoCodeWithUsages } from '$types/PromoCodeTypes';
import { trytm } from '@bdsqqq/try';
import { json, error } from '@sveltejs/kit';
import { eq, inArray } from 'drizzle-orm/expressions';

export async function POST({ request, locals }) {
	// Only logged in users can order

	const sessionUser = locals.session?.user;

	if (!sessionUser) {
		throw error(401, 'Nie jesteś zalogowany');
	}

	// Make sure the request body is valid JSON
	const [data, dataParseError] = await trytm(request.json());
	if (dataParseError) {
		throw error(400, 'Nieprawidłowe dane');
	}

	console.log('validating the order...', data);

	// Validate the request body
	const [order, parseError] = betterZodParse(serverOrderValidation, data);
	if (parseError) {
		console.error('Failed to validate the order', parseError);
		throw error(400, parseError[0]);
	}

	console.log('Successfully validated the order');

	// Modify the order data to match the database schema
	// const order: Optional<typeof orderData, 'promoCodeId'> = {
	// 	...orderData
	// };
	// delete order.promoCodeId;

	const orderHistoryEvent: OrderHistoryEvent = {
		date: new Date(),
		status: 'created',
		type: 'event'
	};

	// Fetch all the products for their current price
	const [productsList, productsError] = await trytm(
		db
			.select({
				id: products.id,
				price: products.price
			})
			.from(products)
			.where(
				inArray(
					products.id,
					order.productsQuantity.map((p) => p.productId)
				)
			)
	);

	if (productsError) {
		throw error(
			500,
			'Niespodziewany błąd. Nie udało się sprawdzić aktualnych cen wybranych produktów'
		);
	}

	if (!productsList.length) {
		throw error(
			400,
			'Nie znaleziono wybranych produktów w bazie danych. Upewnij się, że masz najnowszą wersję aplikacji'
		);
	}

	if (productsList.length !== order.productsQuantity.length) {
		throw error(
			400,
			'Nie znaleziono wszystkich wybranych produktów. Upewnij się, że masz najnowszą wersję aplikacji'
		);
	}

	const noDiscountPrice = productsList.reduce((prev, curr) => {
		return prev + Number(curr.price);
	}, 0);

	// Make sure the price is not 0
	if (noDiscountPrice === 0) {
		throw error(400, 'Nieprawidłowa cena zamówienia');
	}

	let discountPrice = noDiscountPrice;

	// Handle the promo code
	if (order.promoCodeId) {
		const [promoCodeWithUsages, promoCodeError] = await trytm(
			db
				.select({
					promoCode: promoCodes,
					usage: {
						userId: promoCodeUsages.userId
					}
				})
				.from(promoCodes)
				.where(eq(promoCodes.id, order.promoCodeId))
				.leftJoin(promoCodeUsages, eq(promoCodes.id, promoCodeUsages.promoCodeId))
		);

		if (promoCodeError) {
			throw error(500, 'Niespodziewany błąd. Nie udało się pobrać kodu rabatowego');
		}

		if (!promoCodeWithUsages.length) {
			throw error(400, 'Nieprawidłowy kod rabatowy');
		}

		console.log('promoCodeWithUsages', promoCodeWithUsages);

		const parsedPromoCode = promoCodeWithUsages.reduce<PromoCodeWithUsages | null>((acc, row) => {
			const { promoCode, usage } = row;

			if (!acc || Object.keys(acc).length === 0) {
				acc = { ...promoCode, usages: [] };
			}

			if (usage && acc) {
				acc.usages.push(usage.userId);
			}

			return acc;
		}, null);

		console.log('parsedPromoCode', parsedPromoCode);

		if (parsedPromoCode) {
			if (!parsedPromoCode.enabled) {
				throw error(400, 'Kod rabatowy został dezaktywowany');
			}

			// discountPrice or noDiscountPrice?
			if (Number(parsedPromoCode.minCartValue) < noDiscountPrice) {
				throw error(
					400,
					`Podany kod rabatowy działa tylko na koszyk o minimalnej kwocie ${parsedPromoCode.minCartValue} zł`
				);
			}

			if (parsedPromoCode.validSince > new Date()) {
				throw error(400, 'Kod rabatowy jest jeszcze nieaktywny');
			}

			if (parsedPromoCode.validUntil < new Date()) {
				throw error(400, 'Kod rabatowy wygasł');
			}

			// For now it takes the user that has placed the order as the customer
			// but in the future it will be possible for employees to place orders
			// on behalf of customers
			const userCodeUsagesCount = parsedPromoCode.usages.filter(
				(userId) => userId === sessionUser.id
			).length;

			if (userCodeUsagesCount >= parsedPromoCode.perUserLimit) {
				throw error(400, 'Wykorzystałeś już maksymalną ilość zamówień z tym kodem rabatowym');
			}

			if (parsedPromoCode.usages.length >= parsedPromoCode.totalUseLimit) {
				throw error(400, 'Kod rabatowy został wykorzystany maksymalną liczbę razy');
			}

			// Calculate the discount
			if (parsedPromoCode.discountType === 'fixed') {
				discountPrice = noDiscountPrice - Number(parsedPromoCode.discount);
			} else if (parsedPromoCode.discountType === 'percentage') {
				discountPrice =
					noDiscountPrice - (noDiscountPrice * Number(parsedPromoCode.discount)) / 100;
			}
		}
	}

	const newOrder: Omit<
		Order,
		'id' | 'createdAt' | 'updatedAt' | 'estimatedDeliveryDate' | 'driverId'
	> = {
		...order,
		address: order.address,
		customerId: sessionUser.id,
		deliveryStatus: 'pending',
		paymentStatus: 'pending',
		status: 'pending',
		promoCodeId: null,
		orderHistory: [orderHistoryEvent],
		price: discountPrice.toString(),
		discount: (noDiscountPrice - discountPrice).toString(),
		productIds: productsList.map(({ id }) => id)
	};

	console.log('putting this order into the db', newOrder);

	// Insert the order into the database
	const [query, insertOrderError] = await trytm(db.insert(orders).values(newOrder));
	console.log('query', query);
	if (insertOrderError) {
		// Unexpected-error
		console.error('insertOrderError', insertOrderError);
		throw error(
			500,
			'Niespodziewany błąd. Zamówienie jest poprawne, ale nie udało się go utworzyć'
		);
	}

	// await sleep(3);

	const orderId = Number(query.insertId);

	const [, sendEmailError] = await trytm(
		sendOrderConfirmationEmail({
			receiver: sessionUser.email,
			templateData: {
				order_id: orderId,
				discount_price: discountPrice.toFixed(2),
				no_discount_price: noDiscountPrice.toFixed(2),
				discount: (noDiscountPrice - discountPrice).toFixed(2),
				phone_number: sessionUser.phone,
				full_name: sessionUser.fullName,
				first_name: sessionUser.fullName.split(' ')[0],
				address_1: order.address ? `${order.address.city}, ${order.address.zipCode}` : '',
				address_2: order.address ? order.address.street : '',
				delivery_method: '',
				payment_method: 'Gotówka'
			}
		})
	);

	if (sendEmailError) {
		// Unexpected-error
		return json({
			success: true,
			message: 'Przepraszamy, nie udało się wysłać maila z potwierdzeniem zamówienia',
			orderId
		});
	}

	return json({
		success: true,
		orderId
	});
}
