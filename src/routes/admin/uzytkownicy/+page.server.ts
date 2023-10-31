import { user$ } from '$lib/client/schemas/index.js';
import add from '$lib/server/actions/users/add';
import edit from '$lib/server/actions/users/edit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schemas/users';
import { extractParams } from '$lib/server/functions/utils';
import type { UserSortableColumn } from '$types';
import { sql } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';

const sortableColumns: UserSortableColumn[] = ['fullName', 'email', 'role', 'createdAt'];

const pageLimit = 10;

export const load = async ({ url }) => {
	const { page, sort } = extractParams<UserSortableColumn>(url, sortableColumns);

	return {
		users: db.query.users.findMany({
			with: {
				adviser: {
					columns: {
						id: true,
						email: true,
						fullName: true
					}
				},
				address: {
					columns: {
						street: true,
						zipCode: true,
						city: true
					}
				}
			},
			columns: {
				id: true,
				email: true,
				fullName: true,
				role: true,
				phone: true,
				createdAt: true
			},
			offset: (page - 1) * pageLimit,
			limit: pageLimit,
			orderBy: sort
				? (users, { asc, desc }) => (sort.descending ? desc(users[sort.by]) : asc(users[sort.by]))
				: (users, { desc }) => desc(users.createdAt)
		}),
		count: db
			.select({
				count: sql<number>`count(*)`.mapWith(Number)
			})
			.from(users),
		pageLimit,
		addForm: superValidate(user$.addForm),
		editForm: superValidate(user$.editForm)
	};
};

export const actions = {
	add,
	edit
};
