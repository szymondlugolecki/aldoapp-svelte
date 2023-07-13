import type { Role, User } from '$types';
import type { JWTPayload, JWTVerifyResult } from 'jose';

interface ATPayloadWithUserEmail extends JWTPayload {
	user: {
		id: string;
		email: string;
		fullName: string;
		role: Role;
		access: boolean;
		phone: string;
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
	'id' | 'email' | 'fullName' | 'role' | 'access' | 'phone' | 'address' | 'adviserId'
>;
