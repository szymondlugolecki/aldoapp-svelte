import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { orderValidation } from '$lib/client/schemas/order';
import { prisma } from '$lib/server/clients/prismaClient';
import { trytm } from '@bdsqqq/try';
import { json, error } from '@sveltejs/kit';

const sleep = (s: number) => new Promise((resolve) => setTimeout(resolve, s * 1000));

export async function POST({ request, locals }) {
	await sleep(3);

	// Only logged in users can order
	if (!locals.session?.user) {
		throw error(401, 'Nie jesteś zalogowany');
	}

	const [data, dataParseError] = await trytm(request.json());

	if (dataParseError) {
		throw error(400, 'Nieprawidłowe dane');
	}

	const [orderData, parseError] = betterZodParse(orderValidation, data);
	if (parseError) {
		throw error(400, parseError[0]);
	}

	// status, orderProductsId, customerId

	prisma.order.create({
		data: {
			...orderData,
			customerId: locals.session.user.id,
			status: 'pending'
		}
	});

	// throw redirect(307, '/zamowienie/dziekujemy/_id_zamowienia_');

	return json({
		success: true
	});
}
