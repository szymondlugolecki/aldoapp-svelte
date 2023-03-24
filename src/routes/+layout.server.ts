// import { prisma } from '$lib/server/clients/prismaClient';

export const load = async ({ locals, depends, url }) => {
	depends('session');

	return {
		user: locals.session?.user,
		url: url.href
	};
};
