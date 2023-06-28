import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { serverOrderValidation } from '$lib/client/schemas/order';
import { sendOrderConfirmationEmail } from '$lib/server/clients/sendGridClient';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schemas/products';
import { trytm } from '@bdsqqq/try';
import { json, error } from '@sveltejs/kit';
import { inArray } from 'drizzle-orm';
import { addOrder, addOrderProducts } from '$lib/server/functions/db.js';

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

	// const orderHistoryEvent: OrderHistoryEvent = {
	// 	date: new Date(),
	// 	status: 'created',
	// 	type: 'event'
	// };

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

	const { promoCodeId } = order;

	// Handle the promo code
	if (promoCodeId) {
		const [promoCodeWithUses, promoCodeError] = await trytm(
			db.query.promoCodes.findFirst({
				with: {
					uses: true
				},
				where: (promoCodes, { eq }) => eq(promoCodes.id, promoCodeId)
			})
		);

		// db
		// .select({
		// 	promoCode: promoCodes,
		// 	usage: {
		// 		userId: promoCodeUses.userId
		// 	}
		// })
		// .from(promoCodes)
		// .where(eq(promoCodes.id, order.promoCodeId))
		// .leftJoin(promoCodeUses, eq(promoCodes.id, promoCodeUses.promoCodeId))

		if (promoCodeError) {
			throw error(500, 'Niespodziewany błąd. Nie udało się pobrać kodu rabatowego');
		}

		if (!promoCodeWithUses) {
			throw error(400, 'Nieprawidłowy kod rabatowy');
		}

		console.log('promoCodeWithUses', promoCodeWithUses);

		// const parsedPromoCode = promoCodeWithUses.reduce<PromoCodeWithUses | null>((acc, row) => {
		// 	const { promoCode, usage } = row;

		// 	if (!acc || Object.keys(acc).length === 0) {
		// 		acc = { ...promoCode, uses: [] };
		// 	}

		// 	if (usage && acc) {
		// 		acc.uses.push(usage.userId);
		// 	}

		// 	return acc;
		// }, null);

		console.log('promoCodeWithUses', promoCodeWithUses);

		if (promoCodeWithUses) {
			if (!promoCodeWithUses.enabled) {
				throw error(400, 'Kod rabatowy został dezaktywowany');
			}

			// discountPrice or noDiscountPrice?
			if (Number(promoCodeWithUses.minCartValue) < noDiscountPrice) {
				throw error(
					400,
					`Podany kod rabatowy działa tylko na koszyk o minimalnej kwocie ${promoCodeWithUses.minCartValue} zł`
				);
			}

			if (promoCodeWithUses.validSince > new Date()) {
				throw error(400, 'Kod rabatowy jest jeszcze nieaktywny');
			}

			if (promoCodeWithUses.validUntil < new Date()) {
				throw error(400, 'Kod rabatowy wygasł');
			}

			// For now it takes the user that has placed the order as the customer
			// but in the future it will be possible for employees to place orders
			// on behalf of customers
			const userCodeUsesCount = promoCodeWithUses.uses.filter(
				({ userId }) => userId === sessionUser.id
			).length;

			if (userCodeUsesCount >= promoCodeWithUses.perUserLimit) {
				throw error(400, 'Wykorzystałeś już maksymalną ilość zamówień z tym kodem rabatowym');
			}

			if (promoCodeWithUses.uses.length >= promoCodeWithUses.totalUseLimit) {
				throw error(400, 'Kod rabatowy został wykorzystany maksymalną liczbę razy');
			}

			// Calculate the discount
			if (promoCodeWithUses.discountType === 'fixed') {
				discountPrice = noDiscountPrice - Number(promoCodeWithUses.discount);
			} else if (promoCodeWithUses.discountType === 'percentage') {
				discountPrice =
					noDiscountPrice - (noDiscountPrice * Number(promoCodeWithUses.discount)) / 100;
			}
		}
	}

	const newOrder: Parameters<typeof addOrder>[0] = {
		...order,
		address: order.address,
		customerId: sessionUser.id,
		deliveryStatus: 'pending',
		paymentStatus: 'pending',
		status: 'pending',
		promoCodeId: null,
		price: discountPrice.toString(),
		discount: (noDiscountPrice - discountPrice).toString()
	};

	console.log('putting this order into the db', newOrder);

	// Insert the order into the database
	const [query, insertOrderError] = await trytm(addOrder(newOrder));
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

	const [, insertOrderProductsError] = await trytm(
		addOrderProducts(
			order.productsQuantity.map((pList) => ({
				...pList,
				orderId
			}))
		)
	);
	if (insertOrderError) {
		// Unexpected-error
		console.error('insertOrderProductsError', insertOrderProductsError);
		throw error(
			500,
			'Niespodziewany błąd. Zamówienie jest poprawne, ale nie udało się zapisać zamówionych produktów'
		);
	}

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
