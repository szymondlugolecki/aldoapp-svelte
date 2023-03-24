import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';
import toast from 'svelte-french-toast';
import { base64StringToUint8Arr } from './base64StringToUint8Arr';

export const subscribe = async () => {
	const result = await Notification.requestPermission();

	console.log('result', result);

	if (result === 'denied') {
		return toast.error('Nie zezwolono na powiadomienia', { icon: '🔔', duration: 3000 });
	}

	// check if service worker is supported/exists
	const registration = await navigator.serviceWorker.getRegistration();
	if (!registration) {
		return toast.error('Powiadomienia nie są obsługiwanie', { icon: '🔔', duration: 3000 });
	}

	// toast('Not connected to the push service', { icon: 'ℹ️', duration: 3000 });
	// if subscription already exists, return
	let subscription = await registration.pushManager.getSubscription();
	console.log('sub', subscription);
	if (subscription) {
		return toast('Jesteś już na liście powiadomień', { icon: '🔔', duration: 3000 });
	}

	subscription = await registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: base64StringToUint8Arr(PUBLIC_VAPID_PUBLIC_KEY)
	});

	const response = await fetch('/api/push/subscribe', {
		method: 'POST',
		body: JSON.stringify(subscription),
		headers: {
			'content-type': 'application/json'
		}
	});

	const data: { success: true; message: string } = await response.json();
	if (response.ok) {
		toast.success(data.message, { icon: '🔔', duration: 3000 });
	} else {
		toast.error('Niepowodzenie przy dodawaniu subskrypcji', { icon: '🔔', duration: 3000 });
	}
	console.log('subscription', subscription);
};

export const unsubscribe = async () => {
	const registration = await navigator.serviceWorker.getRegistration();
	if (!registration) {
		return toast.error('Powiadomienia nie są obsługiwanie', { icon: '🔔', duration: 3000 });
	}

	const subscription = await registration.pushManager.getSubscription();

	console.log('unsub', subscription);

	if (!subscription) {
		return toast('Nie jesteś na liście powiadomień', { icon: '🔔', duration: 3000 });
	}

	await subscription.unsubscribe();

	const response = await fetch('/api/push/unsubscribe', {
		method: 'POST',
		body: JSON.stringify(subscription),
		headers: {
			'content-type': 'application/json'
		}
	});

	const data: { success: true; message: string } = await response.json();
	if (response.ok) {
		toast.success(data.message, { icon: '🔔', duration: 3000 });
	} else {
		toast.error('Niepowodzenie przy usuwaniu subskrypcji', { icon: '🔔', duration: 3000 });
	}
};
