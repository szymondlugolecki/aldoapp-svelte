import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (({ locals }) => {
	const session = locals.session;
	if (!session) {
		throw error(401, { message: 'No session' });
	}

	console.log('Your session:', session);

	return new Response(JSON.stringify({ session }));
}) satisfies RequestHandler;
