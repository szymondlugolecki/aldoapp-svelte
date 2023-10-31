import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { error, fail, type Action } from '@sveltejs/kit';
import getCustomError from '$lib/client/constants/customErrors';
import { subscriptions } from '$lib/server/db/schemas/subscriptions';
import { and, eq } from 'drizzle-orm';
import { uaParser } from '$lib/server/functions/auth';
import { setMessage, superValidate } from 'sveltekit-superforms/server';
import { pushSubscription$ } from '$lib/client/schemas';

const unsubscribe: Action = async ({ locals, request }) => {
	console.log('unsubscribing XD');
	const sessionUser = locals.session?.user;
	if (!sessionUser) {
		throw error(...getCustomError('not-logged-in'));
	}

	const form = await superValidate(request, pushSubscription$.unsubscribe);
	if (!form.valid) {
		return fail(400, { form });
	}

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

	if (!currentSubscription) {
		return setMessage(form, 'Subskrypcja nie istnieje');
	}

	const [, deleteSubscriptionError] = await trytm(
		db
			.delete(subscriptions)
			.where(and(eq(subscriptions.userId, sessionUser.id), eq(subscriptions.userAgent, userAgent)))
	);
	if (deleteSubscriptionError) {
		throw error(500, 'Błąd przy usuwaniu subskrypcji powiadomień');
	}

	return setMessage(form, 'Pomyślnie odsubskrybowano');
};

export default unsubscribe;
