import type { User, Role } from '$lib/server/db/schemas/users';

export { Role, User };

export type UserRowType = 'user' | 'role' | 'action' | 'access' | 'joined' | 'profile';

export type UserFilter = {
	blocked: boolean;
	nonblocked: boolean;
	roles: Record<Role, boolean>;
	since: string | null;
	until: string | null;
};

export type ProductAuthor = {
	id: string;
	email: string;
	fullName: string;
	role: Role;
};
