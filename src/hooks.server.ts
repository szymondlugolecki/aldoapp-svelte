import { joseErrorParser, jwtName } from '$lib/server/constants/auth';
import { createAccessToken, verifyToken } from '$lib/server/functions/auth';
import type { JWTTokenResult } from '$types';
import { error, redirect, type Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	console.log('handle');

	const accessToken = event.cookies.get(jwtName.access);
	console.log('access token', accessToken);

	try {
		if (accessToken) {
			const {
				payload: { email, exp }
			}: JWTTokenResult = await verifyToken(accessToken);

			event.locals.session = {
				user: {
					// id: 'abc',
					// role: 'admin',
					email
					// fullName: 'Szymon Długokęcki'
				},
				expires: exp
			};
		}
	} catch (error) {
		const joseErrName = joseErrorParser(error);
		if (joseErrName === 'expired') {
			// Token exists but is expired
			// Renew and continue

			const aTCookie = createAccessToken({ email });
			event.cookies.set(jwtName.access);
		}
		console.error('jose error', error);
	}

	// Add not allowed/unauthorized page which it will redirect to
	console.log(event.url.pathname, event.url.pathname.startsWith('/admin'));
	if (event.url.pathname.startsWith('/admin')) {
		console.log(event.locals.session, Boolean(event.locals.session));
		if (!event.locals.session) {
			throw error(401, { message: 'Nie masz wystarczających uprawień' });
			// redirect(302, '/');
		}

		if (event.locals.session.user.role) {
			if (!['admin', 'moderator'].includes(event.locals.session.user.role)) {
				throw redirect(302, '/');
			}
		}
	}

	const response = await resolve(event);
	return response;
}) satisfies Handle;
