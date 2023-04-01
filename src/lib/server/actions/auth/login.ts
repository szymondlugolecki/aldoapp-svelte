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
import { eq } from 'drizzle-orm/expressions';
import { users, verificationTokens, type VerificationToken } from '$lib/server/db/schemas/users';

const handleLogin: Action = async ({ request }) => {
	// Validate the user input
	const data = Object.fromEntries(await request.formData());
	const [result, parseError] = betterZodParse(loginSchema, data);
	if (parseError) {
		return fail(400, {
			errors: parseError
		});
	}
	// const { email } = result;
	const email = result.email.toLowerCase();

	// Check if the user exists (was invited)
	const [usersQuery, fetchUserError] = await trytm(
		db.select({ id: users.id }).from(users).where(eq(users.email, email))
	);

	if (fetchUserError) {
		// Unexpected-error
		return fail(500, {
			errors: ['Niespodziewany błąd']
		});
	}

	const user = usersQuery[0];

	if (!user) {
		return fail(401, {
			errors: ['Podany adres email nie uzyskał dostępu']
		});
	}

	// Create a verification token & send the email
	const { code, token } = createVerificationKeys();

	const userAgent = uaParser(request.headers.get('User-Agent'));

	const newVerificationToken: Omit<VerificationToken, 'createdAt' | 'id'> = {
		code,
		token,
		userAgent,
		userId: user.id,
		expiresAt: new Date(Date.now() + verificationKeysExpirationTime)
	};

	const [, createTokenError] = await trytm(
		db.insert(verificationTokens).values(newVerificationToken)
	);

	if (createTokenError) {
		// Unexpected-error
		return fail(500, {
			errors: ['Niespodziewany błąd']
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
				'Przepraszamy, nie udało się wysłać maila weryfikacyjnego. Proszę spróbować ponownie.'
			]
		});
	}

	throw redirect(303, '/login/weryfikacja');
};

export default handleLogin;

// p.user.findUnique({
// 	where: {
// 		email
// 	}
// })

// p.verificationToken.upsert({
// 	create: {
// 		code: verificationCode,
// 		email,
// 		expires: new Date(Date.now() + verificationKeysExpirationTime), // 12 hours from now
// 		userAgent: ''
// 	},
// 	update: {
// 		code: verificationCode,
// 		expires: new Date(Date.now() + verificationKeysExpirationTime) // 12 hours from now
// 	},
// 	where: {
// 		email
// 	},
// 	select: {
// 		verificationToken: true
// 	}
// })
