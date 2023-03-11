// import type { SessionUser } from '$types';
import { error, type Handle } from '@sveltejs/kit';

export const handleAuthorization: Handle = ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.session) {
			throw error(401, 'Nie jesteś zalogowany. poggers');
		}

		if (event.locals.session.user.role) {
			if (!['admin', 'moderator'].includes(event.locals.session.user.role)) {
				throw error(403, 'Nie masz wystarczających uprawień. poggers');
			}
		}
	}

	return resolve(event);
};
