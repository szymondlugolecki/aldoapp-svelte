import getCustomError from '$lib/client/constants/customErrors';
// import { p } from '$lib/server/clients/pClient';
import { trytm } from '@bdsqqq/try';
import { error, fail, type Action } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { isAtLeastModerator } from '$lib/client/functions';
import { orderMachine } from '$lib/client/machines/orderStatus';
import { interpret } from 'xstate';
import type { OrderStatus } from '$lib/client/constants/dbTypes';
import { orders } from '$lib/server/db/schemas/orders';
import { eq } from 'drizzle-orm';
import { order$ } from '$lib/client/schemas';
import { sendNotifications } from '$lib/server/functions/push';
import {
	getOrderStatusPushMessage,
	orderStatusEmailDescription,
	orderStatusEmailPreview
} from '$lib/server/constants/messages';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';
import { sendOrderStatusEmail } from '$lib/server/clients/resend';

/*

    It's called fetchStatusHistory but it's more status events history

*/

const fetchStatusHistory = (async ({ request, locals, params }) => {
	const sessionUser = locals.session?.user;
	if (!sessionUser) {
		throw error(...getCustomError('not-logged-in'));
	}
	if (!isAtLeastModerator(sessionUser.role)) {
		throw error(...getCustomError('insufficient-permissions'));
	}
	if (sessionUser.role !== 'admin') {
		throw error(403, 'Tylko administrator ma dostęp do tej funkcji');
	}

	const form = await superValidate(request, order$.orderStatusHistoryForm);
	if (!form.valid) {
		return fail(400, { form });
	}

	// Fetch the status logs history
	const { id } = form.data;
	const [statusLogs, getStatusLogsError] = await trytm(
		db.query.orders.findFirst({
			where: (orders, { eq }) => eq(orders.id, id),
			columns: {},
			with: {
				statusLogs: {
					columns: {
						event: true
					},
					with: {
						user: {
							columns: {
								id: true,
								fullName: true
							}
						}
					}
				}
			}
		})
	);

	if (getStatusLogsError) {
		// Unexpected-error
		console.error('getStatusLogsError', getStatusLogsError);
		return setError(form, 'id', 'Nie udało się pobrać historii statusu zamówienia', {
			status: 500
		});
	}

	return setMessage(form, 'Zaktualizowano status zamówienia');
}) satisfies Action;

export default fetchStatusHistory;
