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

	const [data, dataError] = await trytm(request.json());
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
	const [currentSubscriptions, fetchSubscriptionError] = await trytm(
		db.select().from(subscriptions).where(eq(subscriptions.endpoint, result.endpoint))
	);

	if (fetchSubscriptionError) {
		throw fail(400, {
			errors: 'Błąd przy szukaniu subskrypcji'
		});
	}

	const currentSubscription = currentSubscriptions[0];

	// Subscription exists - update
	if (currentSubscription) {
		const updatedSubscription = {
			subscription: result,
			userId: locals.session?.user.id,
			endpoint: result.endpoint
		} satisfies Omit<Subscription, 'id' | 'createdAt'>;

		const [, updateSubscriptionError] = await trytm(
			db
				.update(subscriptions)
				.set(updatedSubscription)
				.where(eq(subscriptions.endpoint, result.endpoint))
		);

		if (updateSubscriptionError) {
			throw fail(400, {
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
	} satisfies Omit<Subscription, 'id' | 'createdAt'>;

	const [, addSubscriptionError] = await trytm(db.insert(subscriptions).values(newSubscription));

	if (addSubscriptionError) {
		throw fail(400, {
			errors: 'Błąd przy dodawaniu subskrypcji powiadomień'
		});
	}

	return json({
		success: true,
		message: 'Pomyślnie dodano subskrypcję'
	});
}

// p.subscription.upsert({
// 	where: {
// 		endpoint: result.endpoint
// 	},
// 	create: {
// 		subscription: JSON.stringify(result),
// 		userId: locals.session?.user.id,
// 		endpoint: result.endpoint
// 	},
// 	update: {
// 		subscription: JSON.stringify(result),
// 		userId: locals.session?.user.id
// 	}
// })
