import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { pushSubscriptionJSONSchema } from '$lib/client/schemas/pushSubscription';
import { prisma } from '$lib/server/clients/prismaClient';
import { trytm } from '@bdsqqq/try';
import { json, fail } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	const data: PushSubscription = await request.json();
	console.log('data', data);

	const [result, parseError] = betterZodParse(pushSubscriptionJSONSchema, data);
	if (parseError) {
		throw fail(400, {
			errors: 'Błąd przy subskrypcji powiadomień'
		});
	}

	// check if subscription exists
	// if exists, update. if not, create
	const [subscription, addSubscriptionError] = await trytm(
		prisma.subscription.upsert({
			where: {
				endpoint: result.endpoint
			},
			create: {
				subscription: JSON.stringify(result),
				userId: locals.session?.user.id,
				endpoint: result.endpoint
			},
			update: {
				subscription: JSON.stringify(result),
				userId: locals.session?.user.id
			}
		})
	);

	if (addSubscriptionError) {
		throw fail(400, {
			errors: 'Błąd przy subskrypcji powiadomień'
		});
	}

	console.log('subscription', subscription);

	return json({
		success: true,
		message: 'Pomyślnie zapisano subskrypcję'
	});
}
