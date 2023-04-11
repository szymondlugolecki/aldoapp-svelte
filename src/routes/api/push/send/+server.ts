import { errorResponses } from '$lib/client/constants/errorResponses';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { pushNotificationRequest } from '$lib/client/schemas/pushSubscription';
import { db } from '$lib/server/db';
import { subscriptions } from '$lib/server/db/schemas/subscriptions';
// import { p } from '$lib/server/clients/pClient';
import { sendNotifications } from '$lib/server/functions/push';
import { trytm } from '@bdsqqq/try';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm/expressions';
import type { PushSubscription } from 'web-push';
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
	runtime: 'nodejs18.x'
};

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

	const [subscriptionArr, findSubscriptionError] = await trytm(
		db.select().from(subscriptions).where(eq(subscriptions.userId, locals.session.user.id))
	);

	if (findSubscriptionError) {
		throw error(
			400,
			'Niespodziewany błąd. Spróbuj ponownie włączyć powiadomienia w ustawieniach w aplikacji'
		);
	}

	const subscription = subscriptionArr[0];

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
		message: 'Powiadomienia są wysyłane 🔔'
	});
}

// p.subscription.findFirst({
// 	where: {
// 		userId: locals.session.user.id
// 	}
// })
