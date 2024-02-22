import { pushSubscription$ } from '$lib/client/schemas/index.js';
import send from '$lib/server/actions/push/send.js';
import { superValidate } from 'sveltekit-superforms/server';

export const actions = {
	send
};

export const load = async () => {
	return {
		form: await superValidate(pushSubscription$.notification)
	};
};