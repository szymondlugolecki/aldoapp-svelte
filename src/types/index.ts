import type { Product, User } from '@prisma/client';
import type { JWTPayload, JWTVerifyResult } from 'jose';

export type Role = 'customer' | 'moderator' | 'admin';
export type RoleColor = 'blue' | 'green' | 'red';

export type ShortService = 'pasze' | 'komis' | 'market' | 'paliwa' | 'maszyny' | 'serwis';
export type Outlets = 'surowe' | 'myszyniec' | 'ełk' | 'wójtowo';

interface PayloadWithUserEmail extends JWTPayload {
	id: string;
	email: string;
	fullName: string;
	role: Role;
	exp: number;
}

export interface JWTTokenResult extends JWTVerifyResult {
	payload: PayloadWithUserEmail;
}

export type SessionUser = Pick<User, 'id' | 'email' | 'fullName' | 'role' | 'banned'>;

export type UserFilter = {
	blocked: boolean;
	nonblocked: boolean;
	roles: Record<Role, boolean>;
	since: string | null;
	until: string | null;
};

export type ProductFilter = {
	author: User['id'];
	since: string | null;
	until: string | null;
};

export type ProductWithAuthor = Product & {
	author: {
		id: string;
		email: string;
		fullName: string;
	};
};
