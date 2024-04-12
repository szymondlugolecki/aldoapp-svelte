import toast from 'svelte-french-toast';

export const base64StringToUint8Arr = (base64String: string) => {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
};

export const getRegistration = async () => {
	const registration = await navigator.serviceWorker.getRegistration();
	if (!registration) {
		toast.error('Powiadomienia nie są obsługiwanie');
		return;
	}
	return registration;
};

export const getSubscription = async () => {
	const isPushSupported = checkIfIsPushSupported();
	if (!isPushSupported) {
		return null;
	}

	// Check if service worker is supported/exists
	const registration = await getRegistration();
	if (!registration) {
		return null;
	}

	const sub = await registration.pushManager.getSubscription();
	if (!sub) {
		return null;
	}

	return sub;
};

export const checkIfIsPushSupported = () => {
	if (!('serviceWorker' in navigator)) {
		// Service Worker isn't supported on this browser, disable or hide UI.
		return false;
	}

	if (!('PushManager' in window)) {
		// Push isn't supported on this browser, disable or hide UI.
		return false;
	}

	return true;
};
