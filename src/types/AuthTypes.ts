import type { Address } from '$lib/server/db/schemas/orders';
import type { Role, User } from '$types';
import type { JWTPayload, JWTVerifyResult } from 'jose';

interface ATPayloadWithUserEmail extends JWTPayload {
	user: {
		id: string;
		email: string;
		fullName: string;
		role: Role;
		phone: string;
		address: Address | null;
	};
	exp: number;
}

interface RTPayloadWithUserEmail extends JWTPayload {
	userId: string;
	exp: number;
}

export interface JWTAccessTokenResult extends JWTVerifyResult {
	payload: ATPayloadWithUserEmail;
}

export interface JWTRefreshTokenResult extends JWTVerifyResult {
	payload: RTPayloadWithUserEmail;
}

export type SessionUser = Pick<
	User,
	'id' | 'email' | 'fullName' | 'role' | 'phone'
> & { address: Address | null };
