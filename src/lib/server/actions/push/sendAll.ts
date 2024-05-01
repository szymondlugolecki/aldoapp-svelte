import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { error, type Action, redirect } from '@sveltejs/kit';
import { isAtLeastModerator } from '$lib/client/functions';
import { sendNotifications, type PushMessageWithContent } from '$lib/server/functions/push2';
import { setError, setMessage, superValidate, fail } from 'sveltekit-superforms';
import getCustomError from '$lib/client/constants/customErrors';
import { pushSubscription$ } from '$lib/client/schemas';
import { zod } from 'sveltekit-superforms/adapters';

const sendAll: Action = async ({ locals, request }) => {
	const sessionUser = locals.user;
	if (!sessionUser) {
		redirect(303, '/zaloguj');
		// error(...getCustomError('not-logged-in'));;
	}
	if (!isAtLeastModerator(sessionUser.role)) {
		error(...getCustomError('insufficient-permissions'));
	}

	const form = await superValidate(request, zod(pushSubscription$.notificationAll), {
		id: 'sendAll'
	});
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
		db.query.subscriptionsTable.findMany({
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
		return setError(form, 'Błąd serwera podczas szukania docelowych odbiorców wiadomości', {
			status: 500
		});
	}

	try {
		const { success, message } = await sendNotifications(subs, messageObj);
		console.log('sendAll:');
		console.log('success', success);
		console.log('message', message);
	} catch (error) {
		console.error('sendAll error:', error);
	}

	return setMessage(form, 'Wysłano powiadomienia');
};

export default sendAll;
