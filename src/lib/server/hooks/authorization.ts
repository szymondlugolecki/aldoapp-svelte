import { type Handle, redirect } from '@sveltejs/kit';
import { customErrorURL } from '../functions/utils';

export const handleAuthorization: Handle = ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.session) {
			throw redirect(307, customErrorURL('/error/not-logged-in'));
		}

		if (event.locals.session.user.role) {
			if (!['admin', 'moderator'].includes(event.locals.session.user.role)) {
				throw redirect(307, customErrorURL('/error/insufficient-permissions'));
			}
		}
	}

	return resolve(event);
};
