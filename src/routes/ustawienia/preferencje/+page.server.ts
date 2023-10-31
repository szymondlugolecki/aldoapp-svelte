import { pushSubscription$ } from '$lib/client/schemas/index.js';
import subscribe from '$lib/server/actions/push/subscribe';
import unsubscribe from '$lib/server/actions/push/unsubscribe';
import { superValidate } from 'sveltekit-superforms/server';

export const actions = {
	subscribe,
	unsubscribe
};

export const load = async () => {
	const subscribeForm = await superValidate(pushSubscription$.subscription);
	const unsubscribeForm = await superValidate(pushSubscription$.unsubscribe);

	return {
		subscribeForm,
		unsubscribeForm
	};
};
