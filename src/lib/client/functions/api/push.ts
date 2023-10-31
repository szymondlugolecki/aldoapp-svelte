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
