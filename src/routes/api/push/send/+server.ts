import { errorResponses } from '$lib/client/constants/errorResponses';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { pushNotificationRequest } from '$lib/client/schemas/pushSubscription';
import { prisma } from '$lib/server/clients/prismaClient';
import { sendNotifications } from '$lib/server/functions/push';
import { trytm } from '@bdsqqq/try';
import { json, error } from '@sveltejs/kit';
import type { PushSubscription } from 'web-push';

export async function POST({ request, locals }) {
	if (!locals.session) {
		throw error(...errorResponses[401]);
	}
	if (!['admin', 'moderator'].includes(locals.session.user.role)) {
		throw error(...errorResponses[403]);
	}

	const [data, dataParseError] = await trytm<PushSubscription>(request.json());

	if (dataParseError) {
		throw error(400, 'Nieprawidłowe dane');
	}

	const [notificationData, parseError] = betterZodParse(pushNotificationRequest, data);
	if (parseError) {
		throw error(400, parseError[0]);
	}

	const [subscription, findSubscriptionError] = await trytm(
		prisma.subscription.findFirst({
			where: {
				userId: locals.session.user.id
			}
		})
	);

	if (findSubscriptionError || !subscription) {
		throw error(
			400,
			'Niespodziewany błąd. Spróbuj ponownie włączyć powiadomienia w ustawieniach w aplikacji'
		);
	}

	let parsedSubscription: unknown;

	try {
		parsedSubscription = JSON.parse(subscription.subscription as string);
	} catch (err) {
		throw error(
			400,
			'Niespodziewany błąd. Spróbuj ponownie włączyć powiadomienia w ustawieniach w aplikacji'
		);
	}

	sendNotifications([parsedSubscription as PushSubscription], notificationData);

	return json({
		success: true,
		message: 'Powiadomienia są wysyłane 🔔'
	});
}
