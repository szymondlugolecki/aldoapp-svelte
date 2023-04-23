import { type Handle, error } from '@sveltejs/kit';
import { getRoleRank, isAtLeastModerator } from '$lib/client/functions';
import { trytm } from '@bdsqqq/try';
import { errorResponses } from '$lib/client/constants/errorResponses';

export const handleAuthorization: Handle = async ({ event, resolve }) => {
	console.log('authorization hook', event.url.pathname);

	const { session } = event.locals;
	if (session && session.user.access === false) {
		throw error(403, 'Brak dostępu');
	}

	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.session) {
			throw error(...errorResponses[401]);
		}

		if (event.locals.session.user.role) {
			if (!isAtLeastModerator(event.locals.session.user.role)) {
				throw error(...errorResponses[403]);
			}
		}
	}

	if (event.url.pathname.startsWith('/api/update')) {
		if (!event.locals.session) {
			throw error(...errorResponses[401]);
		}

		if (getRoleRank(event.locals.session.user.role) < 1) {
			throw error(...errorResponses[403]);
		}

		const [data, dataParseError] = await trytm(event.request.json());
		if (dataParseError) {
			throw error(400, 'Nieprawidłowe dane');
		}

		event.locals.updateData = data;
	}

	return resolve(event);
};
