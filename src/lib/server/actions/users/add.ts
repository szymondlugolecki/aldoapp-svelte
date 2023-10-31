import getCustomError from '$lib/client/constants/customErrors';
// import { p } from '$lib/server/clients/pClient';
import { trytm } from '@bdsqqq/try';
import { error, type Action, fail } from '@sveltejs/kit';
import { createId } from '@paralleldrive/cuid2';
import { db } from '$lib/server/db';
import { createUserSchema, users } from '$lib/server/db/schemas/users';
import { isAtLeastModerator } from '$lib/client/functions';
import type { z } from 'zod';
import { user$ } from '$lib/client/schemas';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';

type CreateUserSchema = z.infer<typeof createUserSchema>;

const add = (async ({ request, locals }) => {
	// Only moderators and admins are allowed to add a user
	if (!locals.session) {
		throw error(...getCustomError('not-logged-in'));
	}
	if (!isAtLeastModerator(locals.session?.user.role)) {
		throw error(...getCustomError('insufficient-permissions'));
	}

	const form = await superValidate(request, user$.addForm);
	if (!form.valid) {
		return fail(400, { form });
	}

	const userId = createId();
	const { email, fullName, phone, role } = form.data;

	const newUser = {
		id: userId,
		email,
		fullName,
		phone,
		role,
		createdAt: new Date()
	} satisfies CreateUserSchema;

	// Add the user to the database
	const [, addUserError] = await trytm(db.insert(users).values(newUser));

	if (addUserError) {
		// Unexpected-error
		console.error('addUserError', addUserError);
		return setError(form, 'Nie udało się dodać użytkownika', { status: 500 });
	}

	return setMessage(form, 'Pomyślnie dodano użytkownika');
}) satisfies Action;

export default add;
