import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { pushSubscriptionJSONSchema } from '$lib/client/schemas/pushSubscription';
import { prisma } from '$lib/server/clients/prismaClient';
import { trytm } from '@bdsqqq/try';
import { json, fail } from '@sveltejs/kit';

export async function POST({ request }) {
	const data: PushSubscription = await request.json();
	console.log('data', data);

	const [result, parseError] = betterZodParse(pushSubscriptionJSONSchema, data);
	if (parseError) {
		throw fail(400, {
			errors: 'Błąd przy odsubskrypcji powiadomień'
		});
	}

	// check if subscription exists
	// if exists, update. if not, create
	const [, deleteSubscriptionError] = await trytm(
		prisma.subscription.delete({
			where: {
				endpoint: result.endpoint
			}
		})
	);

	if (deleteSubscriptionError) {
		throw fail(400, {
			errors: 'Błąd przy odsubskrypcji powiadomień'
		});
	}

	return json({
		success: true,
		message: 'Pomyślnie odsubskrybowano'
	});
}
