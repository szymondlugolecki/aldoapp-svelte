import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { error, fail, type Action } from '@sveltejs/kit';
import { sendNotifications } from '$lib/server/functions/push';
import getCustomError from '$lib/client/constants/customErrors';
import { pushSubscription$ } from '$lib/client/schemas';
import { subscriptions, type Subscription } from '$lib/server/db/schemas/subscriptions';
import { getPushMessage } from '$lib/server/constants/messages';
import { uaParser } from '$lib/server/functions/auth';
import { and, eq } from 'drizzle-orm';
// import { betterZodParse } from '$lib/client/functions/betterZodParse';
// import { safeParseJSON } from '$lib/client/functions';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';

const subscribe: Action = async ({ locals, request }) => {
	console.log('subscribing XD');
	const sessionUser = locals.session?.user;
	if (!sessionUser) {
		throw error(...getCustomError('not-logged-in'));
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

	console.log('subscribe xD');
	const form = await superValidate(request, pushSubscription$.subscription);
	console.log('form', form.data);
	// form.data.keys = JSON.parse(form.data.keys);
	if (!form.valid) {
		return fail(400, { form });
	}

	const { endpoint, expirationTime, auth, p256dh } = form.data;
	const userAgent = uaParser(request.headers.get('User-Agent'));

	// Check if subscription exists
	const [currentSubscription, fetchSubscriptionError] = await trytm(
		db.query.subscriptions.findFirst({
			where: (subscription) =>
				and(eq(subscription.userId, sessionUser.id), eq(subscription.userAgent, userAgent))
		})
	);
	if (fetchSubscriptionError) {
		// Unexpected-error
		console.error('fetchSubscriptionError', fetchSubscriptionError);
		throw error(500, 'Błąd podczas szukania subskrypcji');
	}
	if (currentSubscription) {
		return setError(form, 'endpoint', 'Subskrypcja już istnieje');
	}

	const keys = {
		auth,
		p256dh
	};

	// Subscription does not exist - create one
	const newSubscription = {
		endpoint,
		expirationTime: expirationTime || null,
		keys,
		userId: sessionUser.id,
		createdAt: new Date(),
		userAgent: uaParser(request.headers.get('User-Agent'))
	} satisfies Omit<Subscription, 'id'>;

	const [, addSubscriptionError] = await trytm(db.insert(subscriptions).values(newSubscription));
	if (addSubscriptionError) {
		throw error(500, 'Błąd przy dodawaniu subskrypcji powiadomień');
	}

	sendNotifications([{ endpoint, expirationTime, keys }], getPushMessage('subscribed'));

	return setMessage(form, 'Pomyślnie zasubskrybowano');
};

export default subscribe;
