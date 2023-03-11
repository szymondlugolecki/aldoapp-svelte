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

// ? Scenarios
// * 1. accessToken cookie ✅ & token is ✅ => just continue
// * 2. accessToken cookie ✅ & token is ❌ => refresh the tokens
// * 3. accessToken cookie ❌ & refreshToken cookie ❌ => no session, just continue
// * 4. accessToken cookie ❌ & refreshToken cookie ✅ => refresh the tokens

export const handle = (async ({ event, resolve }) => {
	// Verify user's access token on every request
	const accessToken = event.cookies.get(jwtName.access);
	const refreshToken = event.cookies.get(jwtName.refresh);

	if (event.locals.session?.user.banned) {
		throw error(403, 'Brak dostępu');
	}

	async function handleTokens() {
		// Check if the Refresh Token cookie exists & is valid
		if (!refreshToken) return;
		const [payloads, verifyError] = await trytm(
			Promise.all([verifyToken(accessToken || ''), verifyToken(refreshToken)])
		);

		let userEmail: string | undefined;

		// One or both of the tokens failed the verification
		// If it was due to expiration, renew both tokens and move on
		if (verifyError) {
			const joseErrName = joseErrorParser(verifyError);
			console.log('Jose Error Name', joseErrName, userEmail);
			if (joseErrName !== 'expired' || !userEmail) return;

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
				return;
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
			return;
		}

		const [atPayload, rtPayload] = payloads;

		if (rtPayload?.payload.email) {
			userEmail = rtPayload.payload.email;
		}

		const exp = atPayload.payload.exp;
		const expires = new Date(exp * 1000);
		console.log('AT ✅ RT ✅\nSession expires', expires);

		if (event.locals.session) return;
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
	}

	await handleTokens();

	// console.log('Session User', event.locals.session?.user);

	// Add not allowed/unauthorized page which it will redirect to
	// console.log(event.url.pathname, event.url.pathname.startsWith('/admin'));
	if (event.url.pathname.startsWith('/admin')) {
		// console.log(event.locals.session, Boolean(event.locals.session));
		if (!event.locals.session) {
			throw error(401, 'Nie jesteś zalogowany. poggers');
			// redirect(302, '/');
		}

		if (event.locals.session.user.role) {
			if (!['admin', 'moderator'].includes(event.locals.session.user.role)) {
				throw error(403, 'Nie masz wystarczających uprawień. poggers');
			}
		}
	}

	const response = await resolve(event);
	return response;
}) satisfies Handle;
