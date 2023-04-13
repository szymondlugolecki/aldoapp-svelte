import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { addUserSchema } from '$lib/client/schemas/users';
import { errorResponses } from '$lib/client/constants/errorResponses';
// import { p } from '$lib/server/clients/pClient';
import { trytm } from '@bdsqqq/try';
import { error, fail, type Action } from '@sveltejs/kit';
import { createId } from '@paralleldrive/cuid2';
import type { User } from '$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schemas/users';
import { isAtLeastModerator } from '$lib/client/functions';

const add = (async ({ request, locals }) => {
	// Only moderators and admins are allowed to add a user
	if (!locals.session) {
		throw error(...errorResponses[401]);
	}
	if (!isAtLeastModerator(locals.session?.user.role)) {
		throw error(...errorResponses[403]);
	}

	// Validate the user input
	const [formData, formDataError] = await trytm(request.formData());
	if (formDataError) {
		return fail(400, {
			errors: ['Niepoprawne dane']
		});
	}

	const data = {
		...Object.fromEntries(formData),
		phone: Object.fromEntries(formData).phone.toString().replaceAll(' ', '') || null
	};

	const [newUserParsed, newUserParseError] = betterZodParse(addUserSchema, data);
	if (newUserParseError) {
		return fail(400, {
			errors: ['Niepoprawne dane']
		});
	}

	const newUser = {
		id: createId(),
		...newUserParsed,
		access: true
	} satisfies Omit<User, 'createdAt' | 'assignedAdviser'>;

	// Add the user to the database
	const [, addUserError] = await trytm(db.insert(users).values(newUser));

	if (addUserError) {
		// Unexpected-error
		console.error('addUserError', addUserError);
		return fail(500, {
			errors: ['Nie udało się dodać użytkownika']
		});
	}

	return { success: true, message: 'Pomyślnie dodano użytkownika' };
}) satisfies Action;

export default add;

// p.user.create({
// 	data: {
// 		id: createId(),
// 		email,
// 		role,
// 		fullName: name
// 	}
// })
