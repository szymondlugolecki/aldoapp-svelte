import getCustomError from '$lib/client/constants/customErrors.js';
import { settings$ } from '$lib/client/schemas/index.js';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schemas/users';
import { trytm } from '@bdsqqq/try';
import { error, fail, type Action } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { setMessage, superValidate } from 'sveltekit-superforms/server';

const phone: Action = async (event) => {
	const sessionUser = event.locals.session?.user;
	if (!sessionUser) {
		error(...getCustomError('not-logged-in'));
	}

	const form = await superValidate(event, settings$.phoneForm);
	if (!form.valid) {
		return fail(400, { form });
	}

	const [, editPhoneError] = await trytm(
		db
			.update(users)
			.set({
				phone: form.data.phone
			})
			.where(eq(users.id, sessionUser.id))
	);

	if (editPhoneError) {
		// Unexpected-error
		console.error('editPhoneError', editPhoneError);
		error(500, 'Błąd podczas zmieniania numeru telefonu');
	}

	console.log('success');
	return setMessage(form, 'Pomyślnie edytowano numer telefonu');
};

export default phone;
