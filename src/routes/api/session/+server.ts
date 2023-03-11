import { error } from '@sveltejs/kit';

export function GET({ locals }) {
	const session = locals.session;
	console.log('locals', locals);
	if (!session) {
		throw error(401, { message: 'No session' });
	}

	return new Response(JSON.stringify({ session }));
}
