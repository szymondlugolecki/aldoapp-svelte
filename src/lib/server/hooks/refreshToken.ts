import {
	accessTokenExpiryDate,
	joseErrorParser,
	jwtName,
	refreshTokenExpiryDate
} from '$lib/server/constants/auth';
import {
	createAccessToken,
	createRefreshToken,
	verifyRefreshToken,
	verifyAccessToken
} from '$lib/server/functions/auth';
// import { p } from '$lib/server/clients/pClient';
// import type { SessionUser } from '$types';
import { error, type Handle } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import { db } from '../db';

// Hooks are used to modify a single request, and are not persisted between requests.
// Setting locals does not persist between requests

// Set the session in locals in 2 cases:
// 1. If the user has a valid access token
// 2. After refreshing both tokens

export const handleTokenRefresh: Handle = async ({ event, resolve }) => {
	const sessionUser = event.locals.session?.user;

	// Verify user's access token on every request
	const accessToken = event.cookies.get(jwtName.access);
	const refreshToken = event.cookies.get(jwtName.refresh);

	// If the user is banned, throw an error
	if (sessionUser && sessionUser.role === 'banned') {
		error(403, 'Brak dostępu');
	}

	// Only makes sense to refresh the tokens if the user has a Refresh Token cookie
	if (!refreshToken) {
		return resolve(event);
	}

	// Verify AT
	const [atPayload, atPayloadError] = await trytm(verifyAccessToken(accessToken));

	// Access token is valid, no need to refresh
	if (atPayload) {
		event.locals.session = {
			user: atPayload.payload.user,
			expires: new Date(atPayload.payload.exp * 1000)
		};

		return resolve(event);
	}

	// AT is invalid (probably expired), now we check if the RT is valid
	const [rtPayload, rtPayloadError] = await trytm(verifyRefreshToken(refreshToken));

	// Invalid refresh token, nothing we can do here
	if (rtPayloadError) {
		// Should I remove the cookies? 🤔
		return resolve(event);
	}

	/*

		The situation we're in:
		* AT is expired (invalid)
		* RT is valid

		so we should refresh both tokens

		But first we will take care of an edge case where
		the token could possibly be corrupted/invalid (not expired!)

	*/

	// If session in locals does not exist, we get the userId from the RT payload
	const userId = sessionUser?.id || rtPayload.payload.userId;
	const joseErrName = joseErrorParser(atPayloadError);

	// If the error is other than 'expired', we don't want to refresh the tokens
	if (joseErrName !== 'expired') {
		// Unexpected-error
		console.error('Unexpected error. Jose threw error other than expired', joseErrName, userId);

		// Should I remove the cookies? 🤔

		if (joseErrName === 'invalid') {
			error(401, 'Sesja została skorumpowana. To błąd ');
		}
	}

	/*
		We confirmed that the AT is expired, and the RT is valid, now we can refresh the tokens
	
		1. Call the db to get the user's data
		2. Create new AT and RT
		3. Update the session
	*/

	const [user, getUserError] = await trytm(
		db.query.users.findFirst({
			where: (users, { eq }) => eq(users.id, userId),
			with: {
				address: {
					columns: {
						zipCode: true,
						city: true,
						street: true
					}
				}
			},
			columns: {
				id: true,
				email: true,
				fullName: true,
				role: true,
				phone: true
			}
		})
	);

	console.log('user', user);

	if (getUserError) {
		// Unexpected-error
		console.error('Błąd przy pobieraniu użytkownika do sesji z bazy danych', getUserError);
		return resolve(event);
	}
	if (!user) {
		// Unexpected-error
		console.error('Zalogowano jako nieistniejący użytkownik. Mógł zostać usunięty');
		error(
			500,
			'Niespodziewany błąd. Sesja istnieje, ale użytkownik nie. Spróbuj zalogować się ponownie.'
		);
	}

	// Create new tokens
	const [result, promiseError] = await trytm(
		Promise.all([createAccessToken(user), createRefreshToken({ userId: user.id })])
	);

	if (promiseError) {
		// Unexpected-error
		console.error('Nie udało się utworzyć nowych tokenów do autoryzacji', promiseError);
		error(500, 'Nie udało się odświeżyć sesji. Spróbuj zalogować się ponownie.');
	}

	const [newAccessToken, newRefreshToken] = result;

	const accessTokenExpirationDate = accessTokenExpiryDate();

	event.cookies.set(jwtName.access, newAccessToken, {
		expires: accessTokenExpirationDate,
		path: '/',
		secure: false
	});

	event.cookies.set(jwtName.refresh, newRefreshToken, {
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
