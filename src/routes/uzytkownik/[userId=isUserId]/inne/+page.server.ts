import { pushSubscription$ } from '$lib/client/schemas/index.js';
import send from '$lib/server/actions/push/send.js';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const actions = {
	send
};

export const load = async () => {
	return {
		form: await superValidate(zod(pushSubscription$.notification))
	};
};
