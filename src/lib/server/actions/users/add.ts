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
import { isAtLeastModerator, isJSON } from '$lib/client/functions';
import type { Address } from '$lib/server/db/schemas/orders';

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
		phone: Object.fromEntries(formData).phone.toString().replaceAll(' ', '') || null,
		address: isJSON<Address>(Object.fromEntries(formData).address) || null
	};

	console.log('new user data', data);

	const [newUserParsed, newUserParseError] = betterZodParse(addUserSchema, data);
	if (newUserParseError) {
		return fail(400, {
			errors: newUserParseError[0]
		});
	}

	if (newUserParsed.role === 'customer') {
		if (!newUserParsed.address) {
			return fail(400, {
				errors: ['Adres jest wymagany dla klienta']
			});
		}

		if (Object.values(newUserParsed.address).some((v) => !v)) {
			return fail(400, {
				errors: ['Nieprawidłowy adres']
			});
		}
	}

	const newUser = {
		id: createId(),
		...newUserParsed,
		access: true
	} satisfies Pick<User, 'id' | 'fullName' | 'email' | 'phone' | 'role' | 'access'>;

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
