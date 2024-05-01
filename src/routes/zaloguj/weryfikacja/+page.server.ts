import handleVerification from '$lib/server/actions/auth/verify';
import { auth$ } from '$lib/client/schemas/index.js';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const actions = {
	default: handleVerification
};

export const load = async () => {
	return { form: await superValidate(zod(auth$.verification)) };
};
