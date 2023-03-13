import { AUTH_SECRET } from '$env/static/private';
import { errors } from 'jose';

const secretEncoded = new TextEncoder().encode(AUTH_SECRET);

const MINUTE = 1000 * 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;

export const verificationKeysExpirationTime = 12 * HOUR;

export const dateInXMinutes = (x: number) => new Date(Date.now() + MINUTE * x);
export const dateInXMonths = (x: number) => new Date(Date.now() + MONTH * x);

export const accessTokenExpiryDate = () => dateInXMinutes(1);
export const refreshTokenExpiryDate = () => dateInXMonths(3.01);

export const jwtConfig = {
	alg: 'HS256',
	secret: secretEncoded,
	accessTokenConfig: {
		expirationTime: '1m'
	},
	refreshTokenConfig: {
		expirationTime: '90d'
	},
	audience: 'aldoapp-user',
	issuer: 'aldoapp'
};

export const jwtName = {
	access: 'access-token',
	refresh: 'refresh-token'
};

export const joseErrorParser = (err: unknown) => {
	if (err instanceof errors.JOSEError) {
		if (err instanceof errors.JWTExpired) return 'expired';
		if (err instanceof errors.JWTInvalid) return 'invalid';
		if (err instanceof errors.JWTClaimValidationFailed) return 'invalid_claim';
		if (err instanceof errors.JOSEAlgNotAllowed) return 'alg_not_allowed';
		if (err instanceof errors.JOSENotSupported) return 'not_supported';
	}
	// Unexpected-error
	console.log('UNEXPECTED ERROR HERE!', err);
	return null;
};
