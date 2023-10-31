import type { User, Role } from '$lib/server/db/schemas/users';

export { Role, User };

export type UserRowType = 'user' | 'role' | 'action' | 'joined' | 'profile';

export type AdminUsersTableColumn = User & {
	id: User['id'];
	adviser: Pick<User, 'email' | 'fullName'> | null;
};

export type UserFilter = {
	blocked: boolean;
	nonblocked: boolean;
	roles: Record<Role, boolean>;
	since: string | null;
	until: string | null;
};

export type BasicUser = {
	id: string;
	email: string;
	fullName: string;
}

export type ProductAuthor = {
	id: string;
	email: string;
	fullName: string;
	role: Role;
};

export type UserSortableColumn = keyof Pick<
	User,
	'fullName' | 'email' | 'role' | 'createdAt'
>;
