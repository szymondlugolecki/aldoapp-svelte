// import { p } from '$lib/server/clients/pClient';
import { fail, redirect, type Action } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';

import { db } from '$lib/server/db';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth$ } from '$lib/client/schemas';
import { lucia } from '$lib/server/auth';

// import { accessTokenExpiryDate, jwtName, refreshTokenExpiryDate } from '$lib/server/constants/auth';
// import { createAccessToken, createRefreshToken } from '$lib/server/functions/auth';
// import { verificationTokensTable } from '$lib/server/db/schemas/verificationTokens';

const verify = (async ({ request, cookies, getClientAddress }) => {
	const form = await superValidate(request, auth$.verification);
	if (!form.valid) {
		return fail(400, { form });
	}

	console.log('verify', 'getClientAddress', getClientAddress());

	// Check if the token exists & is not expired
	const [token, fetchTokenError] = await trytm(
		db.query.verificationTokensTable.findFirst({
			where: (verificationTokens, { eq, and }) =>
				and(
					eq(verificationTokens.code, form.data.code),
					eq(verificationTokens.ipAddress, getClientAddress())
				),
			columns: {
				id: true,
				expiresAt: true
			},
			with: {
				user: {
					columns: {
						id: true,
						email: true,
						role: true,
						fullName: true,
						phone: true,
						adviserId: true
					},
					with: {
						address: {
							columns: {
								city: true,
								zipCode: true,
								street: true
							}
						}
					}
				}
			}
		})
	);
	if (fetchTokenError) {
		// Unexpected-error
		console.log('fetchTokenError', fetchTokenError);
		return setError(form, 'code', 'Błąd serwera podczas sprawdzania kodu weryfikacyjnego', {
			status: 500
		});
	}
	// Non-existent/expired
	if (!token || new Date() > token.expiresAt) {
		return setError(form, 'code', 'Kod nie istnieje lub jest przedawniony', { status: 400 });
	}

	const {
		user: { address, email, fullName, phone, role }
	} = token;

	// Create a session
	const session = await lucia.createSession(token.user.id, {
		address,
		email,
		fullName,
		phone,
		role
	});
	const sessionCookie = lucia.createSessionCookie(session.id);

	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});

	redirect(303, '/');
}) satisfies Action;

export default verify;

/*

	const [createTokens, createTokensError] = await trytm(
		Promise.all([createAccessToken(token.user), createRefreshToken({ userId: token.user.id })])
	);

	if (createTokensError) {
		// Unexpected-error
		console.error('createTokensError', createTokensError);
		error(500, 'Błąd podczas logowania');
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

	locals.session = {
		expires: accessTokenExpiryDate(),
		user: token.user
	};

	const [, deleteTokenError] = await trytm(
		db.delete(verificationTokensTable).where(eq(verificationTokensTable.id, token.id))
	);

	if (deleteTokenError) {
		console.error('deleteTokenError', deleteTokenError);
		// Unexpected-error
		// not that big of a deal
		// just continue
	}

*/
