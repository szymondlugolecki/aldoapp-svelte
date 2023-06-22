import { errorResponses } from '$lib/client/constants/errorResponses';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { pushSubscriptionJSONSchema } from '$lib/client/schemas/pushSubscription';
import { db } from '$lib/server/db';
import { subscriptions, type Subscription } from '$lib/server/db/schemas/subscriptions';
// import { p } from '$lib/server/clients/pClient';
import { trytm } from '@bdsqqq/try';
import { json, fail, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function POST({ request, locals }) {
	if (!locals.session) {
		throw error(...errorResponses[401]);
	}

	const [data, dataError] = await trytm<PushSubscriptionJSON>(request.json());
	console.log('data', data);

	if (dataError) {
		throw fail(400, {
			errors: 'Nieprawidłowe dane do subskrypcji powiadomień'
		});
	}

	const [result, parseError] = betterZodParse(pushSubscriptionJSONSchema, data);
	if (parseError) {
		throw fail(400, {
			errors: 'Nieprawidłowe dane do subskrypcji powiadomień'
		});
	}

	// Check if subscription exists
	const [currentSubscription, fetchSubscriptionError] = await trytm(
		db.query.subscriptions.findFirst({
			where: (subscription, { eq }) => eq(subscription.endpoint, result.endpoint)
		})
	);

	if (fetchSubscriptionError) {
		throw fail(500, {
			errors: 'Błąd przy szukaniu subskrypcji'
		});
	}

	// Subscription exists - update
	if (currentSubscription) {
		const updatedSubscription = {
			subscription: result,
			userId: locals.session.user.id,
			endpoint: result.endpoint
		} satisfies Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>;

		const [, updateSubscriptionError] = await trytm(
			db
				.update(subscriptions)
				.set(updatedSubscription)
				.where(eq(subscriptions.endpoint, result.endpoint))
		);

		if (updateSubscriptionError) {
			throw fail(500, {
				errors: 'Błąd przy aktualizacji subskrypcji powiadomień'
			});
		}

		return json({
			success: true,
			message: 'Pomyślnie zaktualizowano subskrypcję'
		});
	}

	// Subscription does not exist - create
	const newSubscription = {
		subscription: result,
		userId: locals.session.user.id,
		endpoint: result.endpoint
	} satisfies Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>;

	const [, addSubscriptionError] = await trytm(db.insert(subscriptions).values(newSubscription));

	if (addSubscriptionError) {
		throw fail(500, {
			errors: 'Błąd przy dodawaniu subskrypcji powiadomień'
		});
	}

	return json({
		success: true,
		message: 'Pomyślnie dodano subskrypcję'
	});
}
