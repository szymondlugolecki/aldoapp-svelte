import { pushSubscription$ } from '$lib/client/schemas/index.js';
import sendAll from '$lib/server/actions/push/sendAll';
import { superValidate } from 'sveltekit-superforms/server';

export const actions = {
	sendAll
};

export const load = async (event) => {
	return { form: superValidate(event, pushSubscription$.notificationAll, { id: 'sendAll' }) };
};
