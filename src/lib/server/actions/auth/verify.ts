import { prisma } from '$lib/server/clients/prismaClient';
import { fail, redirect, type Action } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { verificationCodeSchema } from '$lib/client/schemas/auth';
import { accessTokenExpiryDate, jwtName, refreshTokenExpiryDate } from '$lib/server/constants/auth';
import { createAccessToken, createRefreshToken } from '$lib/server/functions/auth';

const handleVerification: Action = async ({ request, cookies, locals }) => {
	// Validate the user input
	const data = Object.fromEntries(await request.formData());
	const [codeParsed, codeParsingError] = betterZodParse(verificationCodeSchema, data);
	if (codeParsingError) {
		return fail(400, {
			errors: codeParsingError
		});
	}
	const { code } = codeParsed;

	// Check if the token exists & is not expired
	const [token, getTokenError] = await trytm(
		prisma.verificationToken.findUnique({
			where: {
				code
			},
			select: {
				email: true,
				user: true,
				expires: true
			}
		})
	);

	if (getTokenError) {
		// Unexpected-error
		return fail(500, {
			errors: ['Niespodziewany błąd']
		});
	}

	if (!token || token.expires < new Date()) {
		return fail(400, {
			errors: {
				code: ['Podany kod nie istnieje lub jest przedawniony']
			}
		});
	}

	// Create a new session
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

	throw redirect(303, '/');
};

export default handleVerification;
