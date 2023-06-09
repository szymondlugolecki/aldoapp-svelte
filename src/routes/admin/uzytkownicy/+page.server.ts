import add from '$lib/server/actions/users/add';
import edit from '$lib/server/actions/users/edit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schemas/users';
import { eq } from 'drizzle-orm';

export const load = async () => {
	// const adviser = alias(users, 'advisers');

	return {
		users: Promise.resolve([])
		// db
		// 	.select({
		// 		user: users,
		// 		adviser: { id: adviser.id, email: adviser.email, fullName: adviser.fullName }
		// 	})
		// 	.from(users)
		// 	.leftJoin(adviser, eq(adviser.id, users.assignedAdviser))
	};
};

export const actions = {
	add,
	edit
};
