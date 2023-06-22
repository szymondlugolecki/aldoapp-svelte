import { errorResponses } from '$lib/client/constants/errorResponses';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { pushNotificationRequest } from '$lib/client/schemas/pushSubscription';
import { db } from '$lib/server/db';
// import { p } from '$lib/server/clients/pClient';
import { sendNotifications } from '$lib/server/functions/push';
import { trytm } from '@bdsqqq/try';
import { json, error } from '@sveltejs/kit';
import type { PushSubscription } from 'web-push';
import type { Config } from '@sveltejs/adapter-vercel';
import { isAtLeastModerator } from '$lib/client/functions';

export const config: Config = {
	runtime: 'nodejs18.x'
};

export async function POST({ request, locals }) {
	const { session } = locals;

	if (!session) {
		throw error(...errorResponses[401]);
	}
	if (!isAtLeastModerator(session.user.role)) {
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
		db.query.subscriptions.findFirst({
			where: (subscription, { eq }) => eq(subscription.userId, session.user.id)
		})
	);

	if (findSubscriptionError) {
		throw error(
			500,
			'Niespodziewany błąd. Spróbuj ponownie włączyć powiadomienia w ustawieniach w aplikacji'
		);
	}

	if (!subscription) {
		throw error(
			400,
			'Nie znaleziono subskrypcji. Spróbuj ponownie włączyć powiadomienia w ustawieniach w aplikacji'
		);
	}

	let parsedSubscription: PushSubscriptionJSON | undefined;

	try {
		parsedSubscription = subscription.subscription;
	} catch (err) {
		throw error(
			400,
			'Niespodziewany błąd. Spróbuj ponownie włączyć powiadomienia w ustawieniach w aplikacji'
		);
	}

	sendNotifications([parsedSubscription as PushSubscription], notificationData);

	return json({
		success: true,
		message: 'Powiadomienie zostało wysłane...'
	});
}
