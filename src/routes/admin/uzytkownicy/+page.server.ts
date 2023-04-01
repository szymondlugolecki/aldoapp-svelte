import add from '$lib/server/actions/users/add';
import edit from '$lib/server/actions/users/edit';
// import { p } from '$lib/server/clients/pClient';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schemas/users';

export const load = () => {
	return { users: db.select().from(users) };
	// p.user.findMany({})
};

export const actions = {
	add,
	edit
};
