import { pushSubscription$ } from '$lib/client/schemas/index.js';
import sendAll from '$lib/server/actions/push/sendAll';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const actions = {
	sendAll
};

export const load = async (event) => {
	return {
		form: await superValidate(event, zod(pushSubscription$.notificationAll), { id: 'sendAll' })
	};
};
