// import { p } from '$lib/server/clients/pClient';
import { fail, redirect, error, type Action } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import { accessTokenExpiryDate, jwtName, refreshTokenExpiryDate } from '$lib/server/constants/auth';
import { createAccessToken, createRefreshToken } from '$lib/server/functions/auth';
import { db } from '$lib/server/db';
import { verificationTokens as verificationTokensTable } from '$lib/server/db/schemas/verificationTokens';
import { eq } from 'drizzle-orm';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth$ } from '$lib/client/schemas';

const verify = (async ({ request, cookies, locals }) => {
	const form = await superValidate(request, auth$.verification);
	if (!form.valid) {
		return fail(400, { form });
	}

	// Check if the token exists & is not expired
	const [token, fetchTokenError] = await trytm(
		db.query.verificationTokens.findFirst({
			where: (verificationTokens, { eq }) => eq(verificationTokens.code, form.data.code),
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
		return setError(form, 'code', 'Błąd podczas sprawdzania kodu weryfikacyjnego', { status: 500 });
	}
	// Non-existent/expired
	if (!token || new Date() > token.expiresAt) {
		return setError(form, 'code', 'Kod nie istnieje lub jest przedawniony');
	}

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

	redirect(303, '/');
}) satisfies Action;

export default verify;
