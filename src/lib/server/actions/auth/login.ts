import { createVerificationKeys, getUserAgentString } from '$lib/server/functions/auth';
import { sendVerificationEmail } from '$lib/server/clients/resend';
import { redirect, type Action } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import { db } from '$lib/server/db';
import { auth$ } from '$lib/client/schemas';
import { superValidate, setError, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { UAParser } from 'ua-parser-js';
import { TimeSpan } from 'oslo';
import { addVerificationToken } from '$lib/server/functions/db';

/*

Importing fail from superforms instead of @sveltejs/kit


*/

const login = (async ({ request, getClientAddress, platform }) => {
	console.log('login', 'getClientAddress', getClientAddress());

	const form = await superValidate(request, zod(auth$.login));
	if (!form.valid) {
		return fail(400, { form });
	}

	const { email } = form.data;

	// Check if the user exists (was invited)
	const [user, fetchUserError] = await trytm(
		db.query.usersTable.findFirst({ where: (user, { eq }) => eq(user.email, email) })
	);
	if (fetchUserError) {
		// Unexpected-error
		console.error('fetchUserError', fetchUserError);
		return setError(form, 'Błąd serwera podczas szukania użytkownika', { status: 500 });
	}
	if (!user) {
		return setError(
			form,
			'email',
			'Konto z podanym adresem email nie istnieje. W celu uzyskania dostępu skontaktuj się z administracją',
			{
				status: 404
			}
		);
	}

	// Create a verification token & send the email
	const { code } = createVerificationKeys();

	const userAgentStringified = getUserAgentString(request.headers.get('User-Agent'));
	const userAgentParsed = UAParser(request.headers.get('User-Agent') ?? undefined);
	const userAgent = `${userAgentParsed.os.name} ${userAgentParsed.os.version}, ${userAgentParsed.browser.name} ${userAgentParsed.browser.version}`;
	console.log('city', request.headers.get('x-vercel-ip-city'));
	console.log('platform', platform);

	const verificationTokenExpirationTime = new TimeSpan(1, 'd').milliseconds();

	const [, createTokenError] = await trytm(
		addVerificationToken({
			code,
			userId: user.id,
			userAgent: userAgentStringified,
			ipAddress: getClientAddress(),
			expiresAt: new Date(Date.now() + verificationTokenExpirationTime)
		})
	);

	if (createTokenError) {
		// Unexpected-error
		console.log('createTokenError', createTokenError);
		return setError(form, 'Błąd serwera podczas tworzenia kodu weryfikacyjnego', {
			status: 500
		});
	}

	const [, sendEmailError] = await trytm(
		sendVerificationEmail({
			to: [email],
			from: 'Logowanie <admin@twojealdo.pl>',
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
		console.error('sendEmailError', sendEmailError);
		return setError(form, 'Błąd serwera podczas wysyłania emaila weryfikacyjnego', { status: 500 });
	}

	redirect(303, '/zaloguj/weryfikacja?success=true');
}) satisfies Action;

export default login;
