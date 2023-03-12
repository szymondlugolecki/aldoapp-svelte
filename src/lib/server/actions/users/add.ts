import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { addUserSchema } from '$lib/client/schemas/users';
import { errorResponses } from '$lib/client/constants/errorResponses';
import { prisma } from '$lib/server/clients/prismaClient';
import { trytm } from '@bdsqqq/try';
import { error, fail, type Action } from '@sveltejs/kit';

const add: Action = async ({ request, locals }) => {
	// Only moderators and admins are allowed to add a user
	if (!locals.session) {
		throw error(...errorResponses[401]);
	}
	if (!['admin', 'moderator'].includes(locals.session?.user.role)) {
		throw error(...errorResponses[403]);
	}

	// Validate the user input
	const data = Object.fromEntries(await request.formData());
	const [addUserObj, addUserObjParseError] = betterZodParse(addUserSchema.parse(data));
	if (addUserObjParseError) {
		return fail(400, {
			errors: ['Niepoprawne dane']
		});
	}
	const { email, name, role } = addUserObj;

	// Add the user to the database
	const [, addUserError] = await trytm(
		prisma.user.create({
			data: {
				email,
				role,
				fullName: name
			}
		})
	);

	if (addUserError) {
		return fail(500, {
			errors: ['Nie udało się dodać użytkownika']
		});
	}

	return { success: true, message: 'Pomyślnie dodano użytkownika' };
};

export default add;
