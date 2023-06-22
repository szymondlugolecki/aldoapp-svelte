import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { isJSON } from '$lib/client/functions/index.js';
import { editUserSchema } from '$lib/client/schemas/users';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schemas/users';
import { trytm } from '@bdsqqq/try';
import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	// Must be logged in
	const { session } = locals;
	if (!session) {
		throw error(401, 'Nie jesteś zalogowany');
	}

	const [user, fetchUserError] = await trytm(
		db.query.users.findFirst({ where: (users, { eq }) => eq(users.id, session.user.id) })
	);

	if (fetchUserError) {
		throw error(500, 'Nie udało się pobrać danych użytkownika');
	}

	if (!user) {
		throw error(401, 'Użytkownik nie istnieje');
	}

	return {
		address: user.address
	};
};

export const actions = {
	address: async ({ request, locals }) => {
		// Must be logged in
		if (!locals.session) {
			throw error(401, 'Nie jesteś zalogowany');
		}

		// Validate the user input
		const [formData, formDataError] = await trytm(request.formData());
		if (formDataError) {
			return fail(400, {
				errors: ['Niepoprawne dane']
			});
		}

		const entries = Object.fromEntries(formData);

		const data =
			isJSON(entries.address) && !(entries.address instanceof File)
				? JSON.parse(entries.address)
				: {};

		console.log('formData', formData, 'data', data);

		// Zod parse the address
		const [address, editAddressObjParseError] = betterZodParse(editUserSchema.shape.address, data);
		if (editAddressObjParseError) {
			return fail(400, {
				errors: [editAddressObjParseError[0]]
			});
		}

		console.log('final address', address);

		const [, editUserError] = await trytm(
			db.update(users).set({ address }).where(eq(users.id, locals.session.user.id))
		);

		if (editUserError) {
			return fail(500, {
				errors: ['Nie udało się zmienić adresu']
			});
		}

		return { success: true, message: 'Pomyślnie edytowano adres' };
	}
};
