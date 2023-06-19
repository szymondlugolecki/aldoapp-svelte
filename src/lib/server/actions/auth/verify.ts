// import { p } from '$lib/server/clients/pClient';
import { fail, redirect, type Action } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { verificationCodeSchema } from '$lib/client/schemas/auth';
import { accessTokenExpiryDate, jwtName, refreshTokenExpiryDate } from '$lib/server/constants/auth';
import { createAccessToken, createRefreshToken } from '$lib/server/functions/auth';
import { db } from '$lib/server/db';

const handleVerification: Action = async ({ request, cookies, locals }) => {
	// Validate the user input
	const [formData, formDataError] = await trytm(request.formData());
	if (formDataError) {
		console.error('formDataError', formDataError);
		// Unexpected-error
		return fail(400, {
			errors: ['Podano nieprawidłowe dane']
		});
	}
	const data = Object.fromEntries(formData);
	const [codeParsed, codeParsingError] = betterZodParse(verificationCodeSchema, data);
	if (codeParsingError) {
		return fail(400, {
			errors: codeParsingError
		});
	}

	const { code } = codeParsed;

	// Check if the token exists & is not expired
	const [token, fetchTokenError] = await trytm(
		db.query.verificationTokens.findFirst({
			where: (verificationTokens, { eq }) => eq(verificationTokens.code, code),
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
						access: true,
						phone: true,
						address: true
					}
				}
			}
		})
	);

	if (fetchTokenError) {
		// Unexpected-error
		console.log('fetchTokenError', fetchTokenError);
		return fail(500, {
			errors: ['Niespodziewany błąd przy weryfikacji kodu']
		});
	}

	if (!token || new Date() > token.expiresAt) {
		return fail(400, {
			errors: ['Podany kod nie istnieje lub jest przedawniony']
		});
	}

	const [createTokens, createTokensError] = await trytm(
		Promise.all([createAccessToken(token.user), createRefreshToken({ userId: token.user.id })])
	);

	if (createTokensError) {
		// Unexpected-error
		console.error('createTokensError', createTokensError);
		return fail(500, {
			errors: ['Niespodziewany błąd przy tworzeniu tokenów autoryzacyjnych']
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

	locals.session = {
		expires: accessTokenExpiryDate(),
		user: token.user
	};

	throw redirect(303, '/');
};

export default handleVerification;
