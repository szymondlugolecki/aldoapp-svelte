import type customErrors from '$lib/client/constants/customErrors';
import type { Product, User } from '@prisma/client';
import type { JWTPayload, JWTVerifyResult } from 'jose';

export type Role = 'customer' | 'moderator' | 'admin';
export type RoleColor = 'blue' | 'green' | 'red';

export type ShortService = 'pasze' | 'komis' | 'market' | 'paliwa' | 'maszyny' | 'serwis';
export type Outlets = 'surowe' | 'myszyniec' | 'ełk' | 'wójtowo';

export type CustomError = keyof typeof customErrors;
export type ErrorLocation = `/error/${CustomError}`;

export type ProductRowType = 'image' | 'name' | 'description' | 'author' | 'action' | 'addedAt';

export type UserRowType = 'user' | 'role' | 'action' | 'access' | 'joined' | 'profile';

export type DrawerStore =
	| {
			type: 'user' | 'product';
			action: 'add' | 'filter';
	  }
	| {
			id: string;
			type: 'user' | 'product';
			action: 'edit' | 'remove';
	  };

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
	excludedUserIds: User['id'][];
	since: string | null;
	until: string | null;
};

export type ProductAuthor = {
	id: string;
	email: string;
	fullName: string;
	role: Role;
};

type ProductImage = {
	url: string;
};

export type ProductWithAuthorAndImage = Product & {
	author: ProductAuthor;
	images: ProductImage[];
};
