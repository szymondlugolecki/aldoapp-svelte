import handleVerification from '$lib/server/actions/auth/verify';
import { auth$ } from '$lib/client/schemas/index.js';
import { superValidate } from 'sveltekit-superforms/server';

export const actions = {
	default: handleVerification
};

export const load = () => {
	return { form: superValidate(auth$.verification) };
};
