import { auth$ } from '$lib/client/schemas/index.js';
import handleLogin from '$lib/server/actions/auth/login';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const actions = {
	default: handleLogin
};

export const load = async () => {
	return { form: await superValidate(zod(auth$.login)) };
};
