// import { p } from '$lib/server/clients/pClient';
import { fail, redirect, type Action } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { verificationCodeSchema } from '$lib/client/schemas/auth';
import { accessTokenExpiryDate, jwtName, refreshTokenExpiryDate } from '$lib/server/constants/auth';
import { createAccessToken, createRefreshToken } from '$lib/server/functions/auth';
import { db } from '$lib/server/db';
import {
	users,
	verificationTokens,
	type User,
	type VerificationToken
} from '$lib/server/db/schemas/users';
import { eq } from 'drizzle-orm/expressions';
import type { Optional } from '$types/UtilityTypes';

const handleVerification: Action = async ({ request, cookies, locals }) => {
	// Validate the user input
	const data = Object.fromEntries(await request.formData());
	const [codeParsed, codeParsingError] = betterZodParse(verificationCodeSchema, data);
	if (codeParsingError) {
		return fail(400, {
			errors: codeParsingError
		});
	}

	const { code } = codeParsed;

	// Check if the token exists & is not expired
	const [tokens, getTokenError] = await trytm(
		db
			.select({
				// userId: verificationTokens.userId,
				expiresAt: verificationTokens.expiresAt,
				id: users.id,
				email: users.email,
				role: users.role,
				fullName: users.fullName,
				access: users.access
			})
			.from(verificationTokens)
			.where(eq(verificationTokens.code, code))
			.leftJoin(users, eq(verificationTokens.userId, users.id))
	);

	if (getTokenError) {
		// Unexpected-error
		console.log('getTokenError', getTokenError);
		return fail(500, {
			errors: ['Niespodziewany błąd']
		});
	}
	const token = tokens[0];
	if (!token || new Date() > token.expiresAt) {
		return fail(400, {
			errors: ['Podany kod nie istnieje lub jest przedawniony']
		});
	}

	const dbQueryValuesCheck = <Q extends Record<string, unknown>, T>(
		dbObj: Record<string, unknown>,
		...keys: string[]
	): dbObj is Q & Exclude<T, null> => {
		let allCorrect = true;

		keys.forEach((key) => {
			if (!(key in dbObj) || dbObj[key] === null) {
				allCorrect = false;
			}
		});

		return allCorrect;
	};

	if (
		!dbQueryValuesCheck<Pick<VerificationToken, 'expiresAt'>, Omit<User, 'createdAt'>>(
			token,
			...Object.keys(token).filter((key) => key !== 'createdAt')
		)
	) {
		return fail(400, {
			errors: ['Podany kod nie istnieje lub jest przedawniony']
		});
	}

	// here properties from the user obj are still nullable

	// Create a new session
	const sessionUser = {
		id: token.id,
		email: token.email,
		role: token.role,
		fullName: token.fullName,
		access: token.access
	} satisfies Optional<typeof token, 'expiresAt'>;

	console.log('verify', token.id);

	const [createTokens, createTokensError] = await trytm(
		Promise.all([createAccessToken(sessionUser), createRefreshToken({ userId: token.id })])
	);

	if (createTokensError) {
		// Unexpected-error
		console.error('createTokensError', createTokensError);
		return fail(500, {
			errors: ['Niespodziewany błąd']
		});
	}

	const [accessToken, refreshToken] = createTokens;

	cookies.set(jwtName.access, accessToken, {
		expires: accessTokenExpiryDate(),
		path: '/',
		secure: false
	});

	cookies.set(jwtName.refresh, refreshToken, {
		expires: refreshTokenExpiryDate(),
		path: '/',
		secure: false
	});

	const user: Optional<typeof token, 'expiresAt'> = { ...token };
	delete user.expiresAt;
	locals.session = {
		expires: accessTokenExpiryDate(),
		user
	};
	console.log('locals.session', locals.session);

	throw redirect(303, '/');
};

export default handleVerification;

// p.verificationToken.findUnique({
// 	where: {
// 		code
// 	},
// 	select: {
// 		email: true,
// 		user: true,
// 		expires: true
// 	}
// })
