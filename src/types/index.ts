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
