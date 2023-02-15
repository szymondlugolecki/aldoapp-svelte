import { SignJWT } from 'jose';
import { PUBLIC_WEBSITE_URL } from '$env/static/public';
import { jwtConfig } from '../constants/auth';

const { alg, secret, accessTokenConfig, refreshTokenConfig, audience, issuer } = jwtConfig;

export const createVerificationCode = () =>
	new Array(4)
		.fill(null)
		.map(() => Math.floor(Math.random() * 10))
		.join('');

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
