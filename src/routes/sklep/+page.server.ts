import { superValidate, fail } from 'sveltekit-superforms';
import changeProductQuantity from '$lib/server/actions/cart/changeProductQuantity';
import { cart$ } from '$lib/client/schemas/index.js';
import { zod } from 'sveltekit-superforms/adapters';

export const actions = {
	changeProductQuantity
};

export const load = async () => {
	const form = await superValidate(zod(cart$.changeProductQuantity));
	return { form };
};
