import { verificationCodeValidation } from '$lib/client/schemas/users';
import { accessTokenExpiryDate, jwtName, refreshTokenExpiryDate } from '$lib/server/constants/auth';
import { createAccessToken, createRefreshToken } from '$lib/server/functions/auth';
import { prisma } from '$lib/server/clients/prismaClient';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { error, fail, redirect } from '@sveltejs/kit';
import { z, ZodError } from 'zod';

const verificationCodeSchema = z.object({
	code: verificationCodeValidation
});

export const actions = {
	default: async ({ request, cookies, locals }) => {
		const data = Object.fromEntries(await request.formData());
		let success = false;

		try {
			const { code } = verificationCodeSchema.parse(data);
			console.log('code', code);

			const token = await prisma.verificationToken.findUnique({
				where: {
					code
				},
				select: {
					email: true,
					user: true
				}
			});

			if (!token) {
				return fail(400, {
					errors: {
						code: ['Ten kod nie istnieje lub jest przedawniony']
					}
				});
			}

			// Handle cookies
			const [accessToken, refreshToken] = await Promise.all([
				createAccessToken({ email: token.email }),
				createRefreshToken({ email: token.email })
			]);

			cookies.set(jwtName.access, accessToken, {
				expires: accessTokenExpiryDate(),
				path: '/'
			});

			cookies.set(jwtName.refresh, refreshToken, {
				expires: refreshTokenExpiryDate(),
				path: '/'
			});

			locals.session = {
				user: {
					id: token.user.id,
					email: token.user.email,
					role: token.user.role,
					fullName: token.user.fullName,
					banned: token.user.banned
				},
				expires: accessTokenExpiryDate()
			};

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
			throw redirect(307, '/');
		}
	}
};
