import { redirect, type Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	event.locals.session = {
		user: {
			id: 'abc',
			role: 'admin',
			email: 'szymon.dlugolecki@gmail.com',
			fullName: 'Szymon Długokęcki'
		},
		expires: new Date()
	};

	// Add not allowed/unauthorized page which it will redirect to
	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.session) {
			throw redirect(302, '/');
		}

		if (!['admin', 'moderator'].includes(event.locals.session.user.role)) {
			throw redirect(302, '/');
		}
	}

	const response = await resolve(event);
	return response;
}) satisfies Handle;
