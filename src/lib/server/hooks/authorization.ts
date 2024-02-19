import { type Handle, error } from '@sveltejs/kit';
import { getRoleRank, isAtLeastModerator } from '$lib/client/functions';
import { trytm } from '@bdsqqq/try';
import getCustomError from '$lib/client/constants/customErrors';

export const handleAuthorization: Handle = async ({ event, resolve }) => {
	const { session } = event.locals;
	if (session && session.user.role === 'banned') {
		error(403, 'Brak dostępu');
	}

	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.session) {
			redirect(303, '/zaloguj');
			// error(...getCustomError('not-logged-in'));;
		}

		if (event.locals.session.user.role) {
			if (!isAtLeastModerator(event.locals.session.user.role)) {
				error(...getCustomError('insufficient-permissions'));
			}
		}
	}

	if (event.url.pathname.startsWith('/api/update')) {
		if (!event.locals.session) {
			redirect(303, '/zaloguj');
			// error(...getCustomError('not-logged-in'));;
		}

		if (getRoleRank(event.locals.session.user.role) < 1) {
			error(...getCustomError('insufficient-permissions'));
		}

		const [data, dataParseError] = await trytm(event.request.json());
		if (dataParseError) {
			error(400, 'Nieprawidłowe dane');
		}

		event.locals.updateData = data;
	}

	return resolve(event);
};
