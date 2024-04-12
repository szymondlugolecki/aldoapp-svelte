import { lucia } from '$lib/server/auth';
import { json } from '@sveltejs/kit';

export const POST = async ({ cookies }) => {
	const sessionId = cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		return json({ success: true, message: 'Nie jesteś zalogowany' });
	}

	await lucia.invalidateSession(sessionId);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});

	return json({ success: true, message: 'Wylogowano' });
};
