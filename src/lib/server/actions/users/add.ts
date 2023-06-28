import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { addUserSchema, userPropertySchemas } from '$lib/client/schemas/users';
import { errorResponses } from '$lib/client/constants/errorResponses';
// import { p } from '$lib/server/clients/pClient';
import { trytm } from '@bdsqqq/try';
import { error, fail, type Action } from '@sveltejs/kit';
import { createId } from '@paralleldrive/cuid2';
import { db } from '$lib/server/db';
import { createUserSchema, users } from '$lib/server/db/schemas/users';
import { isAtLeastModerator } from '$lib/client/functions';
import type { z } from 'zod';

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
		// address: isJSON<Address>(Object.fromEntries(formData).address) || null
	};

	console.log('new user data', data);

	const [insertUserData, newUserParseError] = betterZodParse(addUserSchema, data);
	if (newUserParseError) {
		return fail(400, {
			errors: newUserParseError[0]
		});
	}

	console.log('');

	const userAddress = {
		city: insertUserData.city,
		street: insertUserData.street,
		zipCode: insertUserData.zipCode
	};

	console.log('passed the first validation');

	if (insertUserData.role === 'customer') {
		console.log('is customer, checking for address validity');
		if (Object.values(userAddress).every((v) => !v)) {
			return fail(400, {
				errors: ['Adres jest wymagany dla klienta']
			});
		}

		if (userPropertySchemas.address.safeParse(userAddress).success !== true) {
			return fail(400, {
				errors: ['Nieprawidłowy adres']
			});
		}
	}

	const fixedAddressUser = (flatUser: typeof insertUserData) => {
		delete flatUser.city;
		delete flatUser.street;
		delete flatUser.zipCode;

		console.log('fixed address user', flatUser);

		const [parsedAddress, addressParseError] = betterZodParse(
			userPropertySchemas.address,
			userAddress
		);

		if (addressParseError) {
			return {
				...flatUser,
				address: null
			};
		}

		return {
			...flatUser,
			address: parsedAddress
		};
	};

	const newUserParsed = fixedAddressUser(insertUserData);

	type CreateUserSchema = z.infer<typeof createUserSchema>;

	const newUser = {
		id: createId(),
		...newUserParsed,
		access: true
	} satisfies CreateUserSchema;

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
