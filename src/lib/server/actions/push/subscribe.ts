import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { fail, type Action, redirect } from '@sveltejs/kit';
import { sendNotifications } from '$lib/server/functions/push2';
import { pushSubscription$ } from '$lib/client/schemas';
import { subscriptionsTable, type SelectSubscription } from '$lib/server/db/schemas/subscriptions';
import { getPushMessage } from '$lib/server/constants/messages';
import { getUserAgentString } from '$lib/server/functions/auth';
import { and, eq } from 'drizzle-orm';
// import { betterZodParse } from '$lib/client/functions/betterZodParse';
// import { safeParseJSON } from '$lib/client/functions';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';

const subscribe: Action = async ({ locals, request }) => {
	console.log('subscribing XD');
	const sessionUser = locals.user;
	if (!sessionUser) {
		redirect(303, '/zaloguj');
		// error(...getCustomError('not-logged-in'));;
	}

	// const entries = Object.fromEntries(await request.formData());
	// // Need to parse the stringified keys
	// const formData = {
	// 	...entries,
	// 	keys: typeof entries.keys === 'string' && safeParseJSON(entries.keys)
	// };

	// const [subscription, invalidSubscription] = betterZodParse(
	// 	pushSubscription$.subscription,
	// 	formData
	// );
	// if (invalidSubscription) {
	// 	return fail(400, { errors: invalidSubscription[0] });
	// }

	const form = await superValidate(request, pushSubscription$.subscription);
	// form.data.keys = JSON.parse(form.data.keys);
	if (!form.valid) {
		return fail(400, { form });
	}

	const { endpoint, expirationTime, auth, p256dh } = form.data;
	const userAgent = getUserAgentString(request.headers.get('User-Agent'));

	// Check if subscription exists
	const [currentSubscription, fetchSubscriptionError] = await trytm(
		db.query.subscriptionsTable.findFirst({
			where: (subscription) =>
				and(eq(subscription.userId, sessionUser.id), eq(subscription.userAgent, userAgent))
		})
	);
	if (fetchSubscriptionError) {
		// Unexpected-error
		console.error('fetchSubscriptionError', fetchSubscriptionError);
		return setError(form, 'Błąd serwera podczas dodawania subskrypcji', {
			status: 500
		});
	}
	if (currentSubscription) {
		return setError(form, 'Subskrypcja już istnieje', { status: 400 });
	}

	const keys = {
		auth,
		p256dh
	};

	// Subscription does not exist - create one
	const newSubscription = {
		endpoint,
		expirationTime: expirationTime ? new Date(expirationTime) : null,
		keys,
		userId: sessionUser.id,
		createdAt: new Date(),
		userAgent: userAgent
	} satisfies Omit<SelectSubscription, 'id'>;

	const [, addSubscriptionError] = await trytm(
		db.insert(subscriptionsTable).values(newSubscription)
	);
	if (addSubscriptionError) {
		return setError(form, 'Błąd serwera podczas dodawania subskrypcji powiadomień', {
			status: 500
		});
	}

	await sendNotifications([{ endpoint, expirationTime, keys }], getPushMessage('subscribed'));

	return setMessage(form, 'Zasubskrybowano');
};

export default subscribe;
