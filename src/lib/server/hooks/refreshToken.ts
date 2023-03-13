import {
	accessTokenExpiryDate,
	joseErrorParser,
	jwtName,
	refreshTokenExpiryDate
} from '$lib/server/constants/auth';
import { createAccessToken, createRefreshToken, verifyToken } from '$lib/server/functions/auth';
import { prisma } from '$lib/server/clients/prismaClient';
// import type { SessionUser } from '$types';
import { error, type Handle } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';

export const handleTokenRefresh: Handle = async ({ event, resolve }) => {
	// Verify user's access token on every request
	const accessToken = event.cookies.get(jwtName.access);
	const refreshToken = event.cookies.get(jwtName.refresh);

	if (event.locals.session?.user.banned) {
		throw error(403, 'Brak dostępu');
	}

	// Check if the Refresh Token cookie exists & is valid
	if (!refreshToken) return resolve(event);
	const [payloads, verifyError] = await trytm(
		Promise.all([verifyToken(refreshToken), verifyToken(accessToken || '')])
	);

	let userEmail = event.locals.session?.user.email;

	// Rare case when the user has the RT token, no AT token and no session in the locals
	if (!userEmail) {
		const { payload } = await verifyToken(refreshToken);
		userEmail = payload.email;
	}

	// One or both of the tokens failed the verification
	// If it was due to expiration, renew both tokens and move on
	if (verifyError) {
		const joseErrName = joseErrorParser(verifyError);
		console.log('Jose Error Name', joseErrName, userEmail);
		if (joseErrName !== 'expired' || !userEmail) return resolve(event);

		const [result, promiseError] = await trytm(
			Promise.all([
				createAccessToken({ email: userEmail }),
				createRefreshToken({ email: userEmail }),
				prisma.user.findFirst({
					where: {
						email: userEmail
					},
					select: {
						id: true,
						email: true,
						fullName: true,
						role: true,
						banned: true
					}
				})
			])
		);

		if (promiseError) {
			// Unexpected-error
			console.error('UNEXPECTED ERROR!!!', promiseError);
			return resolve(event);
		}

		const [accessToken, refreshToken, user] = result;

		if (!user) {
			// Unexpected-error
			throw error(
				400,
				'Nie udało się znaleźć użytkownika z tym mailem. Jeżeli myślisz że to błąd, zaloguj się ponownie.'
			);
		}

		const accessTokenExpirationDate = accessTokenExpiryDate();

		event.cookies.set(jwtName.access, accessToken, {
			expires: accessTokenExpirationDate,
			path: '/'
		});

		event.cookies.set(jwtName.refresh, refreshToken, {
			expires: refreshTokenExpiryDate(),
			path: '/'
		});

		event.locals.session = {
			user: {
				id: user.id,
				email: user.email,
				fullName: user.fullName,
				role: user.role,
				banned: user.banned
			},
			expires: accessTokenExpirationDate
		};

		return resolve(event);
	}

	const [atPayload, rtPayload] = payloads;

	if (rtPayload?.payload.email) {
		userEmail = rtPayload.payload.email;
	}

	const exp = atPayload.payload.exp;
	const expires = new Date(exp * 1000);
	console.log('AT ✅ RT ✅\nSession expires', expires);

	if (event.locals.session) return resolve(event);
	const [dbUser] = await trytm(
		prisma.user.findFirst({
			where: { email: userEmail },
			select: { id: true, email: true, fullName: true, role: true, banned: true }
		})
	);

	if (dbUser) {
		event.locals.session = {
			user: {
				id: dbUser.id,
				email: dbUser.email,
				fullName: dbUser.fullName,
				role: dbUser.role,
				banned: dbUser.banned
			},
			expires
		};
	}

	return resolve(event);
};
