import { user$ } from '$lib/client/schemas/index.js';
import edit from '$lib/server/actions/users/edit';
import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/db/schemas/users.js';
import { clauseConcat, extractParams } from '$lib/server/functions/utils';
import type { UserSortableColumn } from '$types';
import { like, or, sql } from 'drizzle-orm';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error } from '@sveltejs/kit';
import type { Optional } from '$types/UtilityTypes.js';

export const load = async ({ params }) => {
	const { userId } = params;
	const user = await db.query.usersTable.findFirst({
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
		where: (user, { eq }) => eq(user.id, userId)
	});

	if (!user) {
		error(404, {
			message: 'Nie znaleziono użytkownika'
		});
	}

	const defaultUserValues: Optional<typeof user, 'address' | 'adviser'> & {
		adviserId: string | undefined;
	} = {
		...user,
		...user.address,
		adviserId: user.adviser?.id
	};

	delete defaultUserValues.address;
	delete defaultUserValues.adviser;

	console.log('defaultUserValues', defaultUserValues);

	return {
		user,
		form: await superValidate(defaultUserValues, zod(user$.editForm)),
		advisers: await db.query.usersTable.findMany({
			where: (users, { eq }) => eq(users.role, 'adviser'),
			columns: {
				id: true,
				fullName: true,
				email: true
			}
		})
	};
};

export const actions = {
	edit
};
