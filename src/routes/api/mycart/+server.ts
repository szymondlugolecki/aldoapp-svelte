import { prisma } from '$lib/server/clients/prismaClient';
import { error, json } from '@sveltejs/kit';

export function GET({ locals }) {
	prisma.product.findMany({
		where: {
			OR: []
		}
	});
	const session = locals.session;
	if (!session) {
		throw error(401, { message: 'No session' });
	}

	return json(session);
}
