import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { error, type Action, fail } from '@sveltejs/kit';
import { subscriptions } from '$lib/server/db/schemas/subscriptions';
import { inArray } from 'drizzle-orm';
import { isAtLeastModerator } from '$lib/client/functions';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { pushNotificationRequest } from '$lib/client/schemas/pushSubscription';
import { sendNotifications } from '$lib/server/functions/push';

const sendPush: Action = async ({ locals, request }) => {
	const sessionUser = locals.session?.user;

	console.log('send push');

	if (!sessionUser) {
		throw error(401, 'Nie jesteś zalogowany');
	}

	if (!isAtLeastModerator(sessionUser.role)) {
		throw error(403, 'Nie masz wystarczających uprawnień');
	}

	// Validate the user input
	const [formData, formDataError] = await trytm(request.formData());
	console.log('push send', 'formData', formData);
	if (formDataError) {
		return fail(400, {
			errors: ['Nieprawidłowe dane do wysłania powiadomień']
		});
	}

	const entries = Object.fromEntries(formData);

	console.log('push send', 'entries', entries);

	if (!entries.targets) {
		return fail(400, {
			errors: ['Musisz wybrać przynajmniej jednego odbiorcę powiadomienia']
		});
	}

	// Validate the request body
	const [data, parseError] = betterZodParse(pushNotificationRequest, entries);
	if (parseError) {
		console.error('Failed to validate the push send request body', parseError);
		return fail(400, {
			errors: parseError
		});
	}

	const messageObj = {
		title: data.title,
		options: {
			body: data.body
		}
	};

	// Query all subscriptions
	if (data.targets === 'all') {
		const [subs, fetchSubscriptionsError] = await trytm(
			db.query.subscriptions.findMany({
				columns: {
					subscription: true
				}
			})
		);

		if (fetchSubscriptionsError) {
			return fail(500, {
				errors: ['Wystąpił błąd podczas pobierania użytkowników do wysłania powiadomień']
			});
		}

		sendNotifications(
			subs.map(({ subscription }) => subscription),
			messageObj
		);
	}
	// Query specified users' subscriptions
	else {
		const [subs, fetchSubscriptionsError] = await trytm(
			db.select().from(subscriptions).where(inArray(subscriptions.userId, data.targets))
		);

		// db.query.subscriptions.findMany({
		// 	columns: {
		// 		subscription: true,
		// 	},
		// 	where: (subscription) => inArray(subscription.userId, data.targets)
		// })

		if (fetchSubscriptionsError) {
			return fail(500, {
				errors: ['Wystąpił błąd podczas pobierania użytkowników do wysłania powiadomień']
			});
		}

		sendNotifications(
			subs.map(({ subscription }) => subscription),
			messageObj
		);
	}

	return { success: true };
};

export default sendPush;
