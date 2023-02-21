import {
	accessTokenExpiryDate,
	joseErrorParser,
	jwtName,
	refreshTokenExpiryDate
} from '$lib/server/constants/auth';
import { createAccessToken, createRefreshToken, verifyToken } from '$lib/server/functions/auth';
import { prisma } from '$prisma';
// import type { SessionUser } from '$types';
import { error, type Handle } from '@sveltejs/kit';
import { errors } from 'jose';

// ? Scenarios
// * 1. accessToken cookie ✅ & token is ✅ => just continue
// * 2. accessToken cookie ✅ & token is ❌ => refresh the tokens
// * 3. accessToken cookie ❌ & refreshToken cookie ❌ => no session, just continue
// * 4. accessToken cookie ❌ & refreshToken cookie ✅ => refresh the tokens

export const handle = (async ({ event, resolve }) => {
	// Verify user's access token on every request
	const accessToken = event.cookies.get(jwtName.access);
	const refreshToken = event.cookies.get(jwtName.refresh);

	// if (event.locals.session?.user.banned) {
	// 	throw error(403, 'Zostałeś zablokowany przez administrację');
	// }

	// const assignSession = ({ id, role, email, fullName, banned }: SessionUser, expires: Date) => {
	// 	event.locals.session = {
	// 		user: {
	// 			id,
	// 			email,
	// 			fullName,
	// 			role,
	// 			banned
	// 		},
	// 		expires
	// 	};
	// };

	const destroySession = () => {
		event.locals.session = null;
	};

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
				const expires = new Date(exp * 1000);
				console.log('Both tokens exist', 'expires', expires);

				if (!event.locals.session) {
					const dbUser = await prisma.user.findFirst({
						where: { email: userEmail },
						select: { id: true, email: true, fullName: true, role: true, banned: true }
					});

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
				// Everything ok 👍 Reassign the session
			} else {
				console.log('Refresh token exists', 'Access token does not exist');
				throw new errors.JWTExpired('Expired');
			}
		} catch (err) {
			const joseErrName = joseErrorParser(err);
			console.log('Jose Error Name', joseErrName);
			// If it was the JWT expiration that caused the error => Refresh the tokens
			if (joseErrName === 'expired' && userEmail) {
				const [accessToken, refreshToken, user] = await Promise.all([
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

				// assignSession(user, accessTokenExpiryDate());
				event.locals.session = {
					user: {
						id: user.id,
						email: user.email,
						fullName: user.fullName,
						role: user.role,
						banned: user.banned
					},
					expires: accessTokenExpiryDate()
				};
			} else {
				destroySession();
			}
		}
	}

	// console.log('Session User', event.locals.session?.user);

	// Add not allowed/unauthorized page which it will redirect to
	// console.log(event.url.pathname, event.url.pathname.startsWith('/admin'));
	if (event.url.pathname.startsWith('/admin')) {
		// console.log(event.locals.session, Boolean(event.locals.session));
		if (!event.locals.session) {
			throw error(401, { message: 'Nie jesteś zalogowany' });
			// redirect(302, '/');
		}

		if (event.locals.session.user.role) {
			if (!['admin', 'moderator'].includes(event.locals.session.user.role)) {
				throw error(403, { message: 'Nie masz wystarczających uprawień' });
			}
		}
	}

	const response = await resolve(event);
	return response;
}) satisfies Handle;
