import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { error, fail, type Action } from '@sveltejs/kit';
import { eq, inArray } from 'drizzle-orm';
import { isAtLeastModerator } from '$lib/client/functions';
import { sendNotifications, type PushMessageWithContent } from '$lib/server/functions/push';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';
import getCustomError from '$lib/client/constants/customErrors';
import { pushSubscription$ } from '$lib/client/schemas';

const send: Action = async (event) => {
	const sessionUser = event.locals.session?.user;
	if (!sessionUser) {
		error(...getCustomError('not-logged-in'));
	}
	if (!isAtLeastModerator(sessionUser.role)) {
		error(...getCustomError('insufficient-permissions'));
	}

	console.log('event');
	const form = await superValidate(event, pushSubscription$.notification);
	console.log('form', form.errors, form.data);

	if (!form.valid) {
		return fail(400, { form });
	}

	const messageObj = {
		data: { title: form.data.title, message: form.data.body },
		options: {
			ttl: 172800
		}
	} satisfies PushMessageWithContent;

	const { targets } = form.data;

	const [subscriptionList, fetchSubscriptionsError] = await trytm(
		Array.isArray(targets)
			? db.query.subscriptions.findMany({
					columns: {
						endpoint: true,
						keys: true,
						expirationTime: true
					},
					where: (subscription) => inArray(subscription.userId, targets)
			  })
			: db.query.subscriptions.findMany({
					columns: {
						endpoint: true,
						keys: true,
						expirationTime: true
					},
					where: (subscription) => eq(subscription.userId, targets)
			  })
	);

	if (fetchSubscriptionsError) {
		// Unexpected-error
		console.error('fetchSubscriptionsError', fetchSubscriptionsError);
		error(500, 'Błąd podczas pobierania użytkowników do wysłania powiadomień');
	}

	const { message, success } = await sendNotifications(subscriptionList, messageObj);
	if (!success) {
		return setError(form, 'body', message, { status: 400 });
	}

	return setMessage(form, message);
};

export default send;
