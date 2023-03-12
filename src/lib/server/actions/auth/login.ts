import { verificationKeysExpirationTime } from '$lib/server/constants/auth';
import { createVerificationCode, createVerificationLink } from '$lib/server/functions/auth';
import { sendVerificationEmail } from '$lib/server/clients/sendGridClient';
import { prisma } from '$lib/server/clients/prismaClient';
import { fail, redirect, type Action } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { loginSchema } from '$lib/client/schemas/auth';

// export const handleLogin: Handle = async ({ event, request, resolve }) => {

// } catch (err) {
// 	console.log('err', err);
// 	if (err instanceof ZodError) {
// 		const { fieldErrors: errors } = err.flatten();
// 		return fail(400, {
// 			errors
// 		});
// 	}

// 	if (err instanceof PrismaClientKnownRequestError) {
// 		console.log('prisma error', err.code, err.message);
// 		throw error(500, { message: 'Niespodziewany błąd. Spróbuj ponownie' });
// 	}

// 	throw error(500, { message: 'Niespodziewany błąd. Spróbuj ponownie' });
// }
// };

const handleLogin: Action = async ({ request }) => {
	// Validate the user input
	const data = Object.fromEntries(await request.formData());
	const [result, parseError] = betterZodParse(loginSchema, data);
	if (parseError) {
		return fail(400, {
			errors: parseError
		});
	}
	const { email } = result;

	// Check if the user exists (was invited)
	const [user, fetchUserError] = await trytm(
		prisma.user.findUnique({
			where: {
				email
			}
		})
	);

	if (fetchUserError) {
		// Unexpected-error
		return fail(500, {
			errors: ['Niespodziewany błąd']
		});
	}

	if (!user) {
		return fail(401, {
			errors: ['Podany adres email nie uzyskał dostępu']
		});
	}

	// Create a verification token & send the email
	const verificationCode = createVerificationCode();

	const [tokenResult, createTokenError] = await trytm(
		prisma.verificationToken.upsert({
			create: {
				code: verificationCode,
				email,
				expires: new Date(Date.now() + verificationKeysExpirationTime) // 12 hours from now
			},
			update: {
				code: verificationCode,
				expires: new Date(Date.now() + verificationKeysExpirationTime) // 12 hours from now
			},
			where: {
				email
			},
			select: {
				verificationToken: true
			}
		})
	);

	if (createTokenError) {
		// Unexpected-error
		return fail(500, {
			errors: ['Niespodziewany błąd']
		});
	}

	const { verificationToken } = tokenResult;

	const verificationLink = createVerificationLink(verificationToken);

	const [, sendEmailError] = await trytm(
		sendVerificationEmail({
			receiver: email,
			code: verificationCode,
			link: verificationLink
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
