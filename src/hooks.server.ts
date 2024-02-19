// import { sequence } from '@sveltejs/kit/hooks';
// import { handleAuthorization } from '$lib/server/hooks/authorization';
// import { handleTokenRefresh } from '$lib/server/hooks/refreshToken';

// ? Scenarios
// * 1. accessToken cookie ✅ & token is ✅ => just continue
// * 2. accessToken cookie ✅ & token is ❌ => refresh the tokens
// * 3. accessToken cookie ❌ & refreshToken cookie ❌ => no session, just continue
// * 4. accessToken cookie ❌ & refreshToken cookie ✅ => refresh the tokens

// export const handle = sequence(handleTokenRefresh, handleAuthorization);

import { isAtLeastModerator } from '$lib/client/functions';
import { lucia } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	// Is logged in
	if (session) {
		// Redirect to home if trying to log in again
		if (event.url.pathname.startsWith('/zaloguj')) {
			redirect(303, '/');
		}

		// Redirect to home if trying to access admin with no permissions
		if (!isAtLeastModerator(user.role) && event.url.pathname.startsWith('/admin')) {
			redirect(303, '/');
		}
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};
