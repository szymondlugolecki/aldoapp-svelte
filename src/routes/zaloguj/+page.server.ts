import { auth$ } from '$lib/client/schemas/index.js';
import handleLogin from '$lib/server/actions/auth/login';
import { superValidate } from 'sveltekit-superforms/server';

export const actions = {
	default: handleLogin
};

export const load = async () => {
	return { form: await superValidate(auth$.login) };
};