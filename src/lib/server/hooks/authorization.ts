import { type Handle, error } from '@sveltejs/kit';
import { getRoleRank, isAtLeastModerator } from '$lib/client/functions';
import { trytm } from '@bdsqqq/try';
import getCustomError from '$lib/client/constants/customErrors';

export const handleAuthorization: Handle = async ({ event, resolve }) => {
	const { session } = event.locals;
	if (session && session.user.role === 'banned') {
		throw error(403, 'Brak dostępu');
	}

	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.session) {
			throw error(...getCustomError('not-logged-in'));
		}

		if (event.locals.session.user.role) {
			if (!isAtLeastModerator(event.locals.session.user.role)) {
				throw error(...getCustomError('insufficient-permissions'));
			}
		}
	}

	if (event.url.pathname.startsWith('/api/update')) {
		if (!event.locals.session) {
			throw error(...getCustomError('not-logged-in'));
		}

		if (getRoleRank(event.locals.session.user.role) < 1) {
			throw error(...getCustomError('insufficient-permissions'));
		}

		const [data, dataParseError] = await trytm(event.request.json());
		if (dataParseError) {
			throw error(400, 'Nieprawidłowe dane');
		}

		event.locals.updateData = data;
	}

	return resolve(event);
};
