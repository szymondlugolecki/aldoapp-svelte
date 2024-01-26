import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { error, fail, type Action } from '@sveltejs/kit';
import { isAtLeastModerator } from '$lib/client/functions';
import { sendNotifications, type PushMessageWithContent } from '$lib/server/functions/push';
import { setMessage, superValidate } from 'sveltekit-superforms/server';
import getCustomError from '$lib/client/constants/customErrors';
import { pushSubscription$ } from '$lib/client/schemas';

const sendAll: Action = async ({ locals, request }) => {
	const sessionUser = locals.session?.user;
	if (!sessionUser) {
		error(...getCustomError('not-logged-in'));
	}
	if (!isAtLeastModerator(sessionUser.role)) {
		error(...getCustomError('insufficient-permissions'));
	}

	const form = await superValidate(request, pushSubscription$.notificationAll, { id: 'sendAll' });
	if (!form.valid) {
		return fail(400, { form });
	}

	const messageObj = {
		data: {
			title: form.data.title,
			message: form.data.body
		},
		options: {
			ttl: 172800
		}
	} satisfies PushMessageWithContent;

	const [subs, fetchSubscriptionsError] = await trytm(
		db.query.subscriptions.findMany({
			columns: {
				endpoint: true,
				keys: true,
				expirationTime: true
			}
		})
	);

	if (fetchSubscriptionsError) {
		// Unexpected-error
		console.error('fetchSubscriptionsError', fetchSubscriptionsError);
		error(500, 'Błąd podczas pobierania użytkowników do wysłania powiadomień');
	}

	sendNotifications(subs, messageObj);

	return setMessage(form, 'Wysłano powiadomienia');
};

export default sendAll;
