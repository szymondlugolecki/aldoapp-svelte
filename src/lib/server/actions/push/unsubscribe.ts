import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { fail, type Action, redirect } from '@sveltejs/kit';
import { subscriptionsTable } from '$lib/server/db/schemas/subscriptions';
import { and, eq } from 'drizzle-orm';
import { getUserAgentString } from '$lib/server/functions/auth';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';
import { pushSubscription$ } from '$lib/client/schemas';

const unsubscribe: Action = async ({ locals, request }) => {
	const sessionUser = locals.user;
	if (!sessionUser) {
		redirect(303, '/zaloguj');
		// error(...getCustomError('not-logged-in'));;
	}

	const form = await superValidate(request, pushSubscription$.unsubscribe);
	if (!form.valid) {
		return fail(400, { form });
	}

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
		return setError(form, 'Błąd serwera podczas szukania subskrypcji', {
			status: 500
		});
	}

	if (!currentSubscription) {
		return setError(form, 'Subskrypcja nie istnieje', { status: 400 });
	}

	const [, deleteSubscriptionError] = await trytm(
		db
			.delete(subscriptionsTable)
			.where(
				and(
					eq(subscriptionsTable.userId, sessionUser.id),
					eq(subscriptionsTable.userAgent, userAgent)
				)
			)
	);
	if (deleteSubscriptionError) {
		return setError(form, 'Błąd serwera podczas usuwania subskrypcji', {
			status: 500
		});
	}

	return setMessage(form, 'Odsubskrybowano');
};

export default unsubscribe;
