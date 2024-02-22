import { VAPID_PRIVATE_KEY, ADMIN_CONTACT_EMAIL } from '$env/static/private';
import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';

import { generatePushHTTPRequest, ApplicationServerKeys, generateKeys } from 'web-push-edge';
import type { Jsonifiable, RequireAtLeastOne } from 'type-fest';

interface PushMessage {
	data: Jsonifiable;
	options?: RequireAtLeastOne<{
		ttl?: number;
		topic?: string;
		urgency?: 'low' | 'normal' | 'high';
	}>;
}

interface PushSubscription {
	endpoint: string;
	expirationTime: null | unknown;
	keys: {
		auth: string;
		p256dh: string;
	};
}

export interface PushMessageWithContent extends PushMessage {
	data: {
		title: string;
		message: string;
	};
}

const sendPushMessage = async (
	endpoint: string,
	keys: ApplicationServerKeys,
	message: PushMessageWithContent
) => {
	const {
		headers,
		body,
		endpoint: fetchEndpoint
	} = await generatePushHTTPRequest({
		applicationServerKeys: keys,
		payload: message,
		target: {
			endpoint: endpoint,
			keys: {
				p256dh: PUBLIC_VAPID_PUBLIC_KEY,
				auth: VAPID_PRIVATE_KEY
			}
		},
		adminContact: ADMIN_CONTACT_EMAIL,
		ttl: 60,
		urgency: 'low'
	});

	const res = await fetch(fetchEndpoint, {
		method: 'POST',
		headers,
		body
	});

	console.log('ok', res.ok, res.status);

	if (res.ok) {
		return { success: true };
	} else {
		return { success: false };
	}
};

export const sendNotifications = async (
	subscriptions: PushSubscription[],
	message: PushMessageWithContent
) => {
	const results: boolean[] = [];

	// Send a push message to each client specified in the subscriptions array
	for await (const subscription of subscriptions) {
		const keys = await generateKeys({
			publicKey: subscription.keys.p256dh,
			privateKey: subscription.keys.auth
		});
		const { success } = await sendPushMessage(subscription.endpoint, keys, message);

		if (success) {
			results.push(true);
		} else {
			results.push(false);
		}

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
