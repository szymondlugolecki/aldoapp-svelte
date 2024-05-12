import type { SelectUser, Role } from '$lib/server/db/schemas/users';

export type { Role, SelectUser as User };

export type BasicUser = {
	id: string;
	email: string;
	fullName: string;
};

export type UserSortableColumn = keyof Pick<
	SelectUser,
	'fullName' | 'email' | 'role' | 'createdAt'
>;
