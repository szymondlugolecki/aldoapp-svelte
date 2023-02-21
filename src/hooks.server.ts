import {
	accessTokenExpiryDate,
	joseErrorParser,
	jwtName,
	refreshTokenExpiryDate
} from '$lib/server/constants/auth';
import { createAccessToken, createRefreshToken, verifyToken } from '$lib/server/functions/auth';
import { prisma } from '$prisma';
import type { User } from '@prisma/client';
import { error, redirect, type Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	// Verify user's access token on every request
	const accessToken = event.cookies.get(jwtName.access);
	const refreshToken = event.cookies.get(jwtName.refresh);

	const assignSession = ({ id, role, email, fullName }: Partial<User>, expires: Date) => {
		event.locals.session = {
			user: {
				id,
				role,
				email,
				fullName
			},
			expires
		};
	};

	const createSession = async (email: string) => {
		const [accessToken, refreshToken, user] = await Promise.all([
			createAccessToken({ email }),
			createRefreshToken({ email }),
			prisma.user.findFirst({
				where: {
					email
				},
				select: {
					id: true,
					role: true,
					email: true,
					fullName: true
				}
			})
		]);

		if (!user) {
			throw error(400, { message: 'Użytkownik z tym mailem nie istnieje' });
		}

		event.cookies.set(jwtName.access, accessToken, {
			expires: accessTokenExpiryDate(),
			path: '/'
		});

		event.cookies.set(jwtName.refresh, refreshToken, {
			expires: refreshTokenExpiryDate(),
			path: '/'
		});

		assignSession(user, accessTokenExpiryDate());
	};

	const destroySession = () => {
		event.locals.session = null;
	};

	// ? Scenarios
	// * 1. accessToken cookie ✅ & token is ✅ => just continue
	// * 2. accessToken cookie ✅ & token is ❌ => refresh the tokens
	// * 3. accessToken cookie ❌ & refreshToken cookie ❌ => no session, just continue
	// * 4. accessToken cookie ❌ & refreshToken cookie ✅ => refresh the tokens

	let userEmail: string | undefined;

	// It only makes sense to try to refresh the tokens if the user has the RT cookie
	if (refreshToken) {
		try {
			const [atPayload, rtPayload] = await Promise.all([
				accessToken ? verifyToken(accessToken) : undefined,
				refreshToken ? verifyToken(refreshToken) : undefined
			]);

			if (rtPayload?.payload.email) {
				userEmail = rtPayload?.payload.email;
			}

			if (atPayload) {
				const exp = atPayload.payload.exp;
				const expires = new Date(Date.now() + exp * 1000);
				console.log('Both tokens exist', 'expires', expires, 'exp', exp);
			} else {
				console.log('Refresh token exists', 'Access token does not exist');
			}

			// ! NO NEED FOR THIS I GUESS 🤔
			// Everything ok 👍 Reassign the session
			// assignSession({ email, fullName, id, role }, expires);
		} catch (err) {
			console.error('jose error abc', error);
			const joseErrName = joseErrorParser(err);
			// If it was the JWT expiration that caused the error => Refresh the tokens
			if (joseErrName === 'expired') {
				if (userEmail) {
					createSession(userEmail);
				} else {
					destroySession();
				}
			} else {
				destroySession();
			}
		}
	}

	// Add not allowed/unauthorized page which it will redirect to
	console.log(event.url.pathname, event.url.pathname.startsWith('/admin'));
	if (event.url.pathname.startsWith('/admin')) {
		console.log(event.locals.session, Boolean(event.locals.session));
		if (!event.locals.session) {
			throw error(401, { message: 'Nie masz wystarczających uprawień' });
			// redirect(302, '/');
		}

		if (event.locals.session.user.role) {
			if (!['admin', 'moderator'].includes(event.locals.session.user.role)) {
				throw redirect(302, '/');
			}
		}
	}

	const response = await resolve(event);
	return response;
}) satisfies Handle;
