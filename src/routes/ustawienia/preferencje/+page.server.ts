import { pushSubscription$ } from '$lib/client/schemas/index.js';
// import subscribe from '$lib/server/actions/push/subscribe';
// import unsubscribe from '$lib/server/actions/push/unsubscribe';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

// export const actions = {
// 	subscribe,
// 	unsubscribe
// };

// export const load = async () => {
// 	const subscribeForm = await superValidate(zod(pushSubscription$.subscription));
// 	const unsubscribeForm = await superValidate(zod(pushSubscription$.unsubscribe));

// 	return {
// 		subscribeForm,
// 		unsubscribeForm
// 	};
// };
