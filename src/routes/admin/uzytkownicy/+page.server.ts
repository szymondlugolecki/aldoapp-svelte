import { user$ } from '$lib/client/schemas/index.js';
import add from '$lib/server/actions/users/add';
import edit from '$lib/server/actions/users/edit';
import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/db/schemas/users.js';
import { clauseConcat, extractParams } from '$lib/server/functions/utils';
import type { UserSortableColumn } from '$types';
import { like, or, sql } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';

const sortableColumns: UserSortableColumn[] = ['fullName', 'email', 'role', 'createdAt'];

const pageLimit = 8;

export const load = async ({ url }) => {
	const { search, page, sort } = extractParams<UserSortableColumn>(url, sortableColumns);

	const searchTemplateString = `%${search}%`;
	const searchClause =
		search &&
		or(
			like(usersTable.id, searchTemplateString),
			like(usersTable.fullName, searchTemplateString),
			like(usersTable.email, searchTemplateString)
		);

	const clausesArr = [searchClause];

	const extendedWhereClause = clauseConcat(...clausesArr);

	const users = await db.query.usersTable.findMany({
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
			? (usersTable, { asc, desc }) =>
					sort.descending ? desc(usersTable[sort.by]) : asc(usersTable[sort.by])
			: (usersTable, { desc }) => desc(usersTable.createdAt),
		where: extendedWhereClause
	});

	const count = (
		await db
			.select({
				count: sql<number>`count(*)`.mapWith(Number)
			})
			.from(usersTable)
			.where(extendedWhereClause)
	)[0].count;

	return {
		users,
		count,
		pageLimit,
		addForm: await superValidate(user$.addForm),
		editForm: await superValidate(user$.editForm),
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
	add,
	edit
};
