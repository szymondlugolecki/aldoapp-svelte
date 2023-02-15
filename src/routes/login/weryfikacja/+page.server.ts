import { NODE_ENV } from '$env/static/private';
import { verificationCodeValidation } from '$lib/client/schemas/users';
import { aTMaxAge, jwtName, rTMaxAge } from '$lib/server/constants/auth';
import { createAccessToken, createRefreshToken } from '$lib/server/functions/auth';
import { prisma } from '$prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { error, fail, redirect } from '@sveltejs/kit';
import { z, ZodError } from 'zod';
import type { Actions } from './$types';

const verificationCodeSchema = z.object({
	code: verificationCodeValidation
});

export const actions = {
	default: async ({ request, cookies }) => {
		const data = Object.fromEntries(await request.formData());
		try {
			const { code } = verificationCodeSchema.parse(data);
			console.log('code', code);

			const token = await prisma.verificationToken.findUnique({
				where: {
					code
				},
				select: {
					email: true
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
			const accessToken = await createAccessToken({ email: token.email });
			cookies.set(jwtName.access, accessToken, {
				maxAge: aTMaxAge,
				sameSite: 'lax',
				httpOnly: true,
				path: '/',
				secure: NODE_ENV === 'development' ? false : true
			});

			const refreshToken = await createRefreshToken({ email: token.email });
			cookies.set(jwtName.access, refreshToken, {
				maxAge: rTMaxAge,
				sameSite: 'lax',
				httpOnly: true,
				path: '/api/auth/refresh',
				secure: NODE_ENV === 'development' ? false : true
			});

			throw redirect(302, '/');
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
	}
} satisfies Actions;
