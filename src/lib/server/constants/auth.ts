import { AUTH_SECRET } from '$env/static/private';

// ! VALUES IN SECONDS
const MINUTE = 60;
const HOUR = 60 * 60;
export const aTMaxAge = MINUTE * 1; // 1 minute
export const rTMaxAge = HOUR * 24 * 60; // 60 days

const secretEncoded = new TextEncoder().encode(AUTH_SECRET);

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

export const verificationKeysExpirationTime = 1000 * 60 * 60 * 12; // 12 hours

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
