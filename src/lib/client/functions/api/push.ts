import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';
import toast from 'svelte-french-toast';
import { base64StringToUint8Arr } from '../base64StringToUint8Arr';
import { sleep } from '@melt-ui/svelte/internal/helpers';

export const subscribe = async () => {
	const result = await Notification.requestPermission();

	console.log('result', result);

	if (result === 'denied') {
		toast.error('Nie zezwolono na powiadomienia', { duration: 3000 });
		return { subscribed: false };
	}

	// check if service worker is supported/exists
	const registration = await navigator.serviceWorker.getRegistration();
	if (!registration) {
		toast.error('Powiadomienia nie są obsługiwanie', { duration: 3000 });
		return { subscribed: false };
	}

	// toast('Not connected to the push service', { icon: 'ℹ️', duration: 3000 });
	// if subscription already exists, return
	let subscription = await registration.pushManager.getSubscription();
	if (subscription) {
		toast('Jesteś już na liście powiadomień', { duration: 3000 });
		return { subscribed: true };
	}

	subscription = await registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: base64StringToUint8Arr(PUBLIC_VAPID_PUBLIC_KEY)
	});

	const response = await fetch('/api/push/subscribe', {
		method: 'POST',
		body: JSON.stringify(subscription.toJSON()),
		headers: {
			'content-type': 'application/json'
		}
	});
	// await sleep(5000);

	const data: { success: true; message: string } = await response.json();
	console.log('subscribe data', data);
	if (response.ok) {
		toast.success(data.message, { duration: 3000 });
		return { subscribed: true };
	} else {
		toast.error('Niepowodzenie przy dodawaniu subskrypcji', { duration: 3000 });
		return { subscribed: false };
	}
	console.log('subscription', subscription);
};

export const unsubscribe = async () => {
	const registration = await navigator.serviceWorker.getRegistration();
	if (!registration) {
		toast.error('Powiadomienia nie są obsługiwanie', { duration: 3000 });
		return { subscribed: false };
	}

	const subscription = await registration.pushManager.getSubscription();

	console.log('unsub', subscription);

	if (!subscription) {
		toast('Nie jesteś na liście powiadomień', { duration: 3000 });
		return { subscribed: false };
	}

	await subscription.unsubscribe();

	const response = await fetch('/api/push/unsubscribe', {
		method: 'POST',
		body: JSON.stringify(subscription.toJSON()),
		headers: {
			'content-type': 'application/json'
		}
	});

	// await sleep(5000);

	const data: { success: true; message: string } = await response.json();
	console.log('unsubscribe data', data);
	if (response.ok) {
		toast.success(data.message, { duration: 3000 });
		return { subscribed: false };
	} else {
		toast.error('Niepowodzenie przy usuwaniu subskrypcji powiadomień', { duration: 3000 });
		return { subscribed: true };
	}
};
