import { error, json } from '@sveltejs/kit';

export function GET({ locals }) {
	const session = locals.session;
	if (!session) {
		error(401, { message: 'No session' });
	}

	return json(session);
}
