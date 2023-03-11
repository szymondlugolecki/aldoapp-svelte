import { emailValidation } from '$lib/client/schemas/users';
import { verificationKeysExpirationTime } from '$lib/server/constants/auth';
import { createVerificationCode, createVerificationLink } from '$lib/server/functions/auth';
import { sendVerificationEmail } from '$lib/server/clients/sendGridClient';
import { prisma } from '$lib/server/clients/prismaClient';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { error, fail, redirect } from '@sveltejs/kit';
import { z, ZodError } from 'zod';

// export const load = async () => {
// 	const users = await prisma.user.findMany({});
// 	console.log(
// 		'users',
// 		users.map((u) => u.email)
// 	);

// 	return { users };
// }

const loginSchema = z.object({
	email: emailValidation
});

export const actions = {
	default: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		let success = false;
		try {
			const { email } = loginSchema.parse(data);
			console.log('email', email);

			const user = await prisma.user.findUnique({
				where: {
					email
				}
			});

			if (!user) {
				return fail(401, {
					errors: {
						email: ['Ten adres email nie uzyskał dostępu']
					}
				});
			}

			// Handle verification email

			const verificationCode = createVerificationCode();

			const { verificationToken } = await prisma.verificationToken.upsert({
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
			});

			const verificationLink = createVerificationLink(verificationToken);

			await sendVerificationEmail({
				receiver: email,
				code: verificationCode,
				link: verificationLink
			});

			success = true;
		} catch (err) {
			console.log('err', err);
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();
				return fail(400, {
					errors
				});
			}

			if (err instanceof PrismaClientKnownRequestError) {
				console.log('prisma error', err.code, err.message);
				throw error(500, { message: 'Niespodziewany błąd. Spróbuj ponownie' });
			}

			throw error(500, { message: 'Niespodziewany błąd. Spróbuj ponownie' });
		}

		if (success) {
			// eslint-disable-next-line no-unsafe-finally
			throw redirect(302, '/login/weryfikacja');
		}
	}
};
