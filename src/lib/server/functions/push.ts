import { VAPID_PRIVATE_KEY, VAPID_SUBJECT } from '$env/static/private';
import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';
// import webpush from 'web-push';
import type { NotificationContent } from '$types';
import { pushSubscriptionJSONSchema } from '$lib/client/schemas/pushSubscription';
import { betterZodParse } from '$lib/client/functions/betterZodParse';

const vapidDetails = {
	publicKey: PUBLIC_VAPID_PUBLIC_KEY,
	privateKey: VAPID_PRIVATE_KEY,
	subject: VAPID_SUBJECT
};

export const sendNotifications = (
	subscriptions: PushSubscriptionJSON[],
	notification: NotificationContent
) => {
	// Create the notification content.
	// const notification = JSON.stringify({
	// 	title: 'Hello, Notifications!',
	// 	options: {
	// 		body: `ID: ${Math.floor(Math.random() * 100)}`
	// 	}
	// });
	// Customize how the push service should attempt to deliver the push message.
	// And provide authentication information.
	const options = {
		TTL: 10000,
		vapidDetails: vapidDetails
	};
	// Send a push message to each client specified in the subscriptions array.
	subscriptions.forEach((sub) => {
		const [subscription, subscriptionParseErr] = betterZodParse(pushSubscriptionJSONSchema, sub);
		if (subscriptionParseErr) {
			console.log('subscriptionParseErr', subscriptionParseErr);
			return;
		}
		const endpoint = subscription.endpoint;
		const id = endpoint.slice(endpoint.length - 8);
		console.log('endpoint', endpoint, 'id', id);
		// webpush
		// 	.sendNotification(subscription, JSON.stringify(notification), options)
		// 	.then((result) => {
		// 		console.log(`Endpoint ID: ${id}`);
		// 		console.log(`Result: ${result.statusCode}`);
		// 	})
		// 	.catch((error) => {
		// 		console.log(`Endpoint ID: ${id}`);
		// 		console.log(`Error: ${error} `);
		// 	});
	});
};
