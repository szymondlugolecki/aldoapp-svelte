import { superValidate } from 'sveltekit-superforms/server';
import changeProductQuantity from '$lib/server/actions/cart/changeProductQuantity';
import { cart$ } from '$lib/client/schemas/index.js';

export const actions = {
	changeProductQuantity
};

export const load = async () => {
	const form = await superValidate(cart$.changeProductQuantity);
	return { form };
};
