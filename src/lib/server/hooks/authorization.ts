import { type Handle, redirect, error } from '@sveltejs/kit';
import { customErrorURL } from '../functions/utils';
import { isAtLeastModerator } from '$lib/client/functions';

export const handleAuthorization: Handle = ({ event, resolve }) => {
	const { session } = event.locals;
	if (session && session.user.access === false) {
		throw error(403, 'Brak dostępu');
	}

	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.session) {
			throw redirect(307, customErrorURL('not-logged-in'));
		}

		if (event.locals.session.user.role) {
			if (!isAtLeastModerator(event.locals.session.user.role)) {
				throw redirect(307, customErrorURL('insufficient-permissions'));
			}
		}
	}

	return resolve(event);
};
