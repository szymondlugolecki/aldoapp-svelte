import {
	accessTokenExpiryDate,
	joseErrorParser,
	jwtName,
	refreshTokenExpiryDate
} from '$lib/server/constants/auth';
import { createAccessToken, createRefreshToken, verifyToken } from '$lib/server/functions/auth';
// import { prisma } from '$lib/server/clients/prismaClient';
// import type { SessionUser } from '$types';
import { error, type Handle } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import { db } from '../db';
import { eq } from 'drizzle-orm/expressions';
import { users } from '../db/schemas/users';

export const handleTokenRefresh: Handle = async ({ event, resolve }) => {
	// Verify user's access token on every request
	const accessToken = event.cookies.get(jwtName.access);
	const refreshToken = event.cookies.get(jwtName.refresh);

	if (event.locals.session?.user.banned) {
		throw error(403, 'Brak dostępu');
	}

	// Only makes sense to refresh the tokens if the user has a Refresh Token cookie
	if (!refreshToken) return resolve(event);

	/*
		refreshToken: exists
		accessToken: unknown
		locals.session: unknown
	*/

	let userEmail = event.locals.session?.user.email;

	const [payloads, verifyError] = await trytm(
		Promise.all([verifyToken(refreshToken), verifyToken(accessToken || '')])
	);

	// User has a refresh token, but no session in event.locals
	// Not sure if this would ever occur, but just in case:
	if (!userEmail) {
		const { payload } = await verifyToken(refreshToken);
		userEmail = payload.email;
	}

	const refreshTokens = async () => {
		// One or both of the tokens failed the verification
		// If it was due to expiration, renew both tokens and move on
		const joseErrName = joseErrorParser(verifyError);
		console.log('Jose Error Name', joseErrName, userEmail);
		if (joseErrName !== 'expired' || !userEmail) {
			// Unexpected-error
			console.log('UNEXPECTED ERROR!!!', joseErrName, userEmail);
			return resolve(event);
		}

		const [result, promiseError] = await trytm(
			Promise.all([
				createAccessToken({ email: userEmail }),
				createRefreshToken({ email: userEmail }),
				db
					.select({
						id: users.id,
						email: users.email,
						fullName: users.fullName,
						role: users.role,
						banned: users.banned
					})
					.from(users)
					.where(eq(users.email, userEmail))
			])
		);

		if (promiseError) {
			// Unexpected-error
			console.error('UNEXPECTED ERROR!!!!', promiseError);
			return resolve(event);
		}

		const [accessToken, refreshToken, [user]] = result;

		if (!user) {
			// Unexpected-error
			throw error(
				400,
				'Nie udało się znaleźć użytkownika z tym mailem. Spróbuj zalogować się ponownie.'
			);
		}

		const accessTokenExpirationDate = accessTokenExpiryDate();

		event.cookies.set(jwtName.access, accessToken, {
			expires: accessTokenExpirationDate,
			path: '/',
			secure: false
		});

		event.cookies.set(jwtName.refresh, refreshToken, {
			expires: refreshTokenExpiryDate(),
			path: '/',
			secure: false
		});

		event.locals.session = {
			user,
			expires: accessTokenExpirationDate
		};

		return resolve(event);
	};

	if (verifyError) {
		return await refreshTokens();
	}

	/*
		refreshToken: exists
		accessToken: exists
		locals.session: unknown
	*/

	const [atPayload, rtPayload] = payloads;

	if (rtPayload?.payload.email) {
		userEmail = rtPayload.payload.email;
	}

	const exp = atPayload.payload.exp;
	const expires = new Date(exp * 1000);
	console.log('AT ✅ RT ✅');

	if (event.locals.session) {
		// both tokens are valid and the session is set
		return resolve(event);
	}

	// both tokens are valid, but the session is not set
	// not sure if this would ever occur, but just in case:

	const [dbUser, getUserError] = await trytm(
		db
			.select({
				id: users.id,
				email: users.email,
				fullName: users.fullName,
				role: users.role,
				banned: users.banned
			})
			.from(users)
			.where(eq(users.email, userEmail))
	);

	// prisma.user.findFirst({
	// 	where: { email: userEmail },
	// 	select: { id: true, email: true, fullName: true, role: true, banned: true }
	// })

	if (getUserError) {
		// Unexpected-error
		console.error('UNEXPECTED ERROR!!!!!', getUserError);
		return resolve(event);
	}

	if (dbUser && dbUser.length) {
		event.locals.session = {
			user: dbUser[0],
			expires
		};
	}

	return resolve(event);
};
