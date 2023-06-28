import { isJSON } from '$lib/client/functions/index.js';
import add from '$lib/server/actions/users/add';
import edit from '$lib/server/actions/users/edit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schemas/users';
import type { UserSortableColumn } from '$types';
import { sql } from 'drizzle-orm';

const sortableColumns: UserSortableColumn[] = ['fullName', 'email', 'role', 'access', 'createdAt'];

const pageLimit = 10;

export const load = async ({ url }) => {
	const page = !isNaN(Number(url.searchParams.get('strona')))
		? Math.max(Number(url.searchParams.get('strona')), 1)
		: 1;

	const sort = url.searchParams.get('sort');
	const desc = url.searchParams.get('desc');

	const descBool = desc && ['true', 'false'].includes(desc) ? isJSON<boolean>(desc) : null;
	const properSort = (sort: string | null): sort is UserSortableColumn => {
		return !!sort && sortableColumns.includes(sort as UserSortableColumn);
	};

	console.log('page', page, sort, 'desc', descBool);

	return {
		users: db.query.users.findMany({
			with: {
				adviser: {
					columns: {
						id: true,
						email: true,
						fullName: true
					}
				}
			},
			columns: {
				id: true,
				email: true,
				fullName: true,
				access: true,
				role: true,
				phone: true,
				createdAt: true,
				address: true
			},
			offset: (page - 1) * pageLimit,
			...(descBool !== null && properSort(sort)
				? {
						orderBy: (users, { asc, desc }) => (descBool ? desc(users[sort]) : asc(users[sort]))
				  }
				: {}),
			limit: pageLimit
			// ...(search
			// 	? {
			// 			where: (users, { sql }) => sql`MATCH(${users.email}) AGAINST(${search} IN BOOLEAN MODE)`
			// 	  }
			// 	: {}),
		}),
		count: db
			.select({
				count: sql<number>`count(*)`.mapWith(Number)
			})
			.from(users),
		pageLimit
	};
};

export const actions = {
	add,
	edit
};
