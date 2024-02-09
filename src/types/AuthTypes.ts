import type { Address } from '$lib/server/db/schemas/orders';
import type { SelectUser } from '$lib/server/db/schemas/users';
import type { JWTPayload, JWTVerifyResult } from 'jose';

interface ATPayloadWithUserEmail extends JWTPayload {
	user: Pick<SelectUser, 'id' | 'email' | 'fullName' | 'role' | 'phone'> & {
		address: Address | null;
	};
	exp: number;
}

interface RTPayloadWithUserEmail extends JWTPayload {
	userId: number;
	exp: number;
}

export interface JWTAccessTokenResult extends JWTVerifyResult {
	payload: ATPayloadWithUserEmail;
}

export interface JWTRefreshTokenResult extends JWTVerifyResult {
	payload: RTPayloadWithUserEmail;
}

export type SessionUser = Pick<SelectUser, 'id' | 'email' | 'fullName' | 'role' | 'phone'> & {
	address: Address | null;
};
