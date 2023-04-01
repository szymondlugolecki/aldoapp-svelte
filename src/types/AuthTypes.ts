import type { Role, User } from '$types';
import type { JWTPayload, JWTVerifyResult } from 'jose';

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

export type SessionUser = Pick<User, 'id' | 'email' | 'fullName' | 'role' | 'access'>;
