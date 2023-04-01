import { errors, jwtVerify, SignJWT } from 'jose';
import { PUBLIC_WEBSITE_URL } from '$env/static/public';
import { jwtConfig } from '../constants/auth';
import type { JWTTokenResult, Role } from '$types';
import { createId } from '@paralleldrive/cuid2';
import { UAParser } from 'ua-parser-js';
import { textCrusher as tC } from '$lib/client/functions';

const { alg, secret, accessTokenConfig, refreshTokenConfig, audience, issuer } = jwtConfig;

export const createVerificationKeys = () => ({
	token: createId(),
	code: new Array(4)
		.fill(null)
		.map(() => Math.floor(Math.random() * 10))
		.join('')
});

export const createVerificationLink = (token: string) =>
	`${PUBLIC_WEBSITE_URL}/login/weryfikacja/${token}`;

export const createRefreshToken = (payload: { email: string }) =>
	new SignJWT(payload)
		.setProtectedHeader({ alg: alg })
		.setIssuedAt()
		.setIssuer(issuer)
		.setSubject(payload.email)
		.setAudience(audience)
		.setExpirationTime(refreshTokenConfig.expirationTime)
		.sign(secret);

export const createAccessToken = (payload: { email: string }) =>
	new SignJWT(payload)
		.setProtectedHeader({ alg: alg })
		.setIssuedAt()
		.setIssuer(issuer)
		.setSubject(payload.email)
		.setAudience(audience)
		.setExpirationTime(accessTokenConfig.expirationTime)
		.sign(secret);

export const verifyToken = async (token: string): Promise<JWTTokenResult> => {
	if (!token) throw new errors.JWTExpired('Token is expired');
	return jwtVerify(token, secret, {
		issuer,
		audience
	}) as Promise<JWTTokenResult>;
};

export const uaParser = (header: string | null) => {
	const UAObj = UAParser(header || undefined);

	const { name: browserName, version: browserVersion } = UAObj.browser;
	const { name: osName, version: osVersion } = UAObj.os;
	const { type: deviceType, vendor: deviceVendor } = UAObj.device;

	const strFb = (str: string | undefined) => str || '';

	const userAgent = [browserName, browserVersion, osName, osVersion, deviceType, deviceVendor]
		.map((str) => strFb(str))
		.join('+');
	return tC(userAgent);
};

export const getRoleRank = (role: Role) => {
	switch (role) {
		case 'customer':
			return 0;
		case 'moderator':
			return 1;
		case 'admin':
			return 2;
	}
};
