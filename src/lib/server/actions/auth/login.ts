import { verificationKeysExpirationTime } from '$lib/server/constants/auth';
import { createVerificationKeys, getUserAgentString } from '$lib/server/functions/auth';
// import { sendVerificationEmail } from '$lib/server/clients/sendGridClient';
import { sendVerificationEmail } from '$lib/server/clients/resend';
import { fail, redirect, type Action } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { addVerificationToken } from '$lib/server/functions/db';
import { auth$ } from '$lib/client/schemas';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { UAParser } from 'ua-parser-js';

const login = (async ({ request, getClientAddress, platform }) => {
	const form = await superValidate(request, auth$.login);
	if (!form.valid) {
		return fail(400, { form });
	}

	const { email } = form.data;

	// Check if the user exists (was invited)
	const [user, fetchUserError] = await trytm(
		db.query.users.findFirst({ where: (user, { eq }) => eq(user.email, email) })
	);
	if (fetchUserError) {
		// Unexpected-error
		console.error('fetchUserError', fetchUserError);
		return setError(form, 'email', 'Błąd podczas szukania użytkownika', { status: 500 });
	}
	if (!user) {
		return setError(
			form,
			'email',
			'Konto z podanym adresem email nie istnieje. W celu uzyskania dostępu skontaktuj się z administracją'
		);
	}

	// Create a verification token & send the email
	const { code } = createVerificationKeys();

	const userAgentStringified = getUserAgentString(request.headers.get('User-Agent'));
	const userAgentParsed = UAParser(request.headers.get('User-Agent') || undefined);
	const userAgent = `${userAgentParsed.os.name} ${userAgentParsed.os.version}, ${userAgentParsed.browser.name} ${userAgentParsed.browser.version}`;
	console.log('city', request.headers.get('x-vercel-ip-city'));
	console.log('platform', platform);

	const [, createTokenError] = await trytm(
		addVerificationToken({
			code,
			userAgent: userAgentStringified,
			userId: user.id,
			expiresAt: new Date(Date.now() + verificationKeysExpirationTime),
			createdAt: new Date()
		})
	);

	if (createTokenError) {
		// Unexpected-error
		console.log('createTokenError', createTokenError);
		return setError(form, 'email', 'Błąd podczas tworzenia kodu. Spróbuj ponownie', {
			status: 500
		});
	}

	const [, sendEmailError] = await trytm(
		sendVerificationEmail({
			to: [email],
			props: {
				code,
				device: userAgent,
				firstName: user.fullName.split(' ')[0],
				ip: getClientAddress(),
				time: new Date().toLocaleString('pl-PL', {
					timeZone: 'Europe/Warsaw',
					month: 'long',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
					year: 'numeric'
				})
			}
		})
	);

	if (sendEmailError) {
		// Unexpected-error
		return setError(
			form,
			'email',
			'Błąd podczas wysyłania emaila weryfikacyjnego. Spróbuj ponownie',
			{ status: 500 }
		);
	}

	throw redirect(303, '/zaloguj/weryfikacja?success=true');
}) satisfies Action;

export default login;
