import { verificationKeysExpirationTime } from '$lib/server/constants/auth';
import {
	createVerificationKeys,
	createVerificationLink,
	uaParser
} from '$lib/server/functions/auth';
import { sendVerificationEmail } from '$lib/server/clients/sendGridClient';
import { fail, redirect, type Action } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { loginSchema } from '$lib/client/schemas/auth';
import { db } from '$lib/server/db';
import { addVerificationToken } from '$lib/server/functions/db';

const handleLogin: Action = async ({ request }) => {
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
	const [result, parseError] = betterZodParse(loginSchema, data);
	if (parseError) {
		return fail(400, {
			errors: parseError
		});
	}

	const email = result.email.toLowerCase();
	console.log('email', email);

	// Check if the user exists (was invited)
	const [user, fetchUserError] = await trytm(
		db.query.users.findFirst({ where: (user, { eq }) => eq(user.email, email) })
	);

	if (fetchUserError) {
		console.error('fetchUserError', fetchUserError);
		// Unexpected-error
		return fail(500, {
			errors: ['Niespodziewany błąd przy szukaniu użytkownika']
		});
	}

	if (!user) {
		return fail(400, {
			errors: ['Konto z podanym adresem email nie istnieje']
		});
	}

	// Create a verification token & send the email
	const { code, token } = createVerificationKeys();

	const userAgent = uaParser(request.headers.get('User-Agent'));

	const [, createTokenError] = await trytm(
		addVerificationToken({
			code,
			token,
			userAgent,
			userId: user.id,
			expiresAt: new Date(Date.now() + verificationKeysExpirationTime)
		})
	);

	if (createTokenError) {
		// Unexpected-error
		console.log('createTokenError', createTokenError);
		return fail(500, {
			errors: ['Niespodziewany błąd przy tworzeniu tokenu weryfikacyjnego']
		});
	}

	const [, sendEmailError] = await trytm(
		sendVerificationEmail({
			receiver: email,
			code,
			link: createVerificationLink(token)
		})
	);

	if (sendEmailError) {
		// Unexpected-error
		return fail(500, {
			errors: [
				'Przepraszamy, nie udało się wysłać maila weryfikacyjnego. Proszę spróbować ponownie'
			]
		});
	}

	throw redirect(303, '/zaloguj/weryfikacja?success=true');
};

export default handleLogin;
