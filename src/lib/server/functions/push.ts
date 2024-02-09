import { VAPID_PRIVATE_KEY, VAPID_SUBJECT } from '$env/static/private';
import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';
// import webpush from 'web-push';
// import { betterZodParse } from '$lib/client/functions/betterZodParse';
// import { pushSubscription$ } from '$lib/client/schemas';
// import type { NotificationContent } from '$types';
// import { buildPushPayload } from '@block65/webcrypto-web-push';

import { buildPushPayload } from '@block65/webcrypto-web-push';
import type {
	buildPushPayload as BuildPushPayload,
	VapidKeys,
	PushMessage,
	PushSubscription
} from '@block65/webcrypto-web-push';

// import {
// 	type PushSubscription,
// 	type PushMessage,
// 	type VapidKeys,
// 	buildPushPayload
// } from '@block65/webcrypto-web-push';

const buildPushPayloadTyped = buildPushPayload as typeof BuildPushPayload;

const vapidDetails = {
	publicKey: PUBLIC_VAPID_PUBLIC_KEY,
	privateKey: VAPID_PRIVATE_KEY,
	subject: VAPID_SUBJECT
} satisfies VapidKeys;

export interface PushMessageWithContent extends PushMessage {
	data: {
		title: string;
		message: string;
	};
}

export const sendNotifications = async (
	subscriptions: PushSubscription[],
	message: PushMessageWithContent
) => {
	const results: boolean[] = [];

	// Send a push message to each client specified in the subscriptions array
	for await (const subscription of subscriptions) {
		const init = await buildPushPayloadTyped(message, subscription, vapidDetails);
		const res = await fetch(subscription.endpoint, init);

		if (res.ok) {
			results.push(true);
		} else {
			results.push(false);
		}

		console.log('ok', res.ok, res.status);

		break;
	}

	const successCount = results.filter((result) => result === true).length;

	// No subscriptions
	if (subscriptions.length === 0) {
		return {
			success: false,
			message: 'Żaden z użytkowników nie ma włączonych powiadomień'
		};
	}

	// All sent
	if (successCount === subscriptions.length) {
		if (subscriptions.length === 1) {
			return {
				success: true,
				message: 'Wysłano wiadomość'
			};
		}

		return {
			success: true,
			message: 'Wysłano wszystkie wiadomości'
		};
	}

	// Not all sent
	if (subscriptions.length === 1) {
		return {
			success: false,
			message: 'Nie udało się wysłać wiadomości'
		};
	}

	if (successCount === 0) {
		return {
			success: false,
			message: 'Nie udało się wysłać żadnej wiadomości'
		};
	}

	return {
		success: true,
		message: `Wysłano ${successCount} z ${subscriptions.length} wiadomości`
	};
};
