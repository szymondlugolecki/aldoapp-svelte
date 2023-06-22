import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { pushSubscriptionJSONSchema } from '$lib/client/schemas/pushSubscription';
import { db } from '$lib/server/db';
import { subscriptions } from '$lib/server/db/schemas/subscriptions';
// import { p } from '$lib/server/clients/pClient';
import { trytm } from '@bdsqqq/try';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
	// No need to be logged in to unsubscribe :)
	const [data, dataError] = await trytm(request.json());
	console.log('data', data);

	if (dataError) {
		throw error(400, 'Nieprawidłowe dane do anulowania subskrypcji powiadomień');
	}

	const [result, parseError] = betterZodParse(pushSubscriptionJSONSchema, data);
	if (parseError) {
		throw error(400, 'Błąd podczas anulowania subskrypcji powiadomień');
	}

	// MAYBE THERE'S NO NEED TO DO CHECK, JUST TRY TO DELETE
	// Check if subscription exists

	// const [, deleteSubscriptionError] = await trytm();

	const [, deleteSubscriptionError] = await trytm(
		db.delete(subscriptions).where(eq(subscriptions.endpoint, result.endpoint))
	);

	if (deleteSubscriptionError) {
		console.log('deleteSubscriptionError', deleteSubscriptionError);
		throw error(500, 'Błąd przy anulowaniu subskrypcji powiadomień');
	}

	return json({
		success: true,
		message: 'Pomyślnie anulowano subskrypcję powiadomień'
	});
}
