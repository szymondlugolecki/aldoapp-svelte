import add from '$lib/server/actions/users/add';
import edit from '$lib/server/actions/users/edit';
import { prisma } from '$prisma';

export const load = () => {
	return { users: prisma.user.findMany({}) };
};

export const actions = {
	add,
	edit
};
