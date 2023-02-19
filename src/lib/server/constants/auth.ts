import { AUTH_SECRET } from '$env/static/private';
import {
	JOSEAlgNotAllowed,
	JOSEError,
	JOSENotSupported,
	JWTClaimValidationFailed,
	JWTExpired,
	JWTInvalid
} from 'jose/dist/types/util/errors';
const secretEncoded = new TextEncoder().encode(AUTH_SECRET);

const MINUTE = 1000 * 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;

export const verificationKeysExpirationTime = 12 * HOUR;

export const dateInXMinutes = (x: number) => new Date(Date.now() + MINUTE * x);
export const dateInXMonths = (x: number) => new Date(Date.now() + MONTH * x);

export const jwtConfig = {
	alg: 'HS256',
	secret: secretEncoded,
	accessTokenConfig: {
		expirationTime: '1m'
	},
	refreshTokenConfig: {
		expirationTime: '60d'
	},
	audience: 'aldoapp-user',
	issuer: 'aldoapp'
};

export const jwtName = {
	access: 'access-token',
	refresh: 'refresh-token'
};

// export const refreshTokenCookieOpts = {
// 	maxAge: rTMaxAge,
// 	sameSite: 'lax',
// 	httpOnly: true,
// 	path: '/api/auth/refresh',
// 	secure: NODE_ENV === 'development' ? false : true
// };

// export const accessTokenCookieOpts = {
// 	maxAge: aTMaxAge,
// 	sameSite: 'lax',
// 	httpOnly: true,
// 	path: '/',
// 	secure: NODE_ENV === 'development' ? false : true
// };

export const JOSEErrors = {
	expired: 'ERR_JWT_EXPIRED'
};

export const joseErrorParser = (err: unknown) => {
	if (err instanceof JOSEError) {
		if (err instanceof JWTExpired) return 'expired';
		if (err instanceof JWTInvalid) return 'invalid';
		if (err instanceof JWTClaimValidationFailed) return 'invalidclaim';
		if (err instanceof JOSEAlgNotAllowed) return 'algnotallowed';
		if (err instanceof JOSENotSupported) return 'notsupported';
	}
	return null;
};
