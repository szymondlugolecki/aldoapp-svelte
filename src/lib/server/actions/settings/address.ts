import getCustomError from '$lib/client/constants/customErrors.js';
import { settings$ } from '$lib/client/schemas/index.js';
import { db } from '$lib/server/db';
import type { Address } from '$lib/server/db/schemas/orders.js';
import { userAddress } from '$lib/server/db/schemas/userAddress.js';
import { sleep } from '$lib/server/functions/utils.js';
import { trytm } from '@bdsqqq/try';
import { error, fail, type Action } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms/server';

const address: Action = async (event) => {
	const sessionUser = event.locals.session?.user;
	if (!sessionUser) {
		error(...getCustomError('not-logged-in'));
	}

	await sleep(3);

	const form = await superValidate(event, settings$.addressForm);
	if (!form.valid) {
		return fail(400, { form });
	}

	const address: Address = {
		street: form.data.street || '',
		zipCode: form.data.zipCode || '',
		city: form.data.city || ''
	};

	// This is nonsense*:
	// Needed to avoid empty fields overwriting existing ones
	// const editAddress: Partial<Address> = {}
	// Object.entries(address).forEach(([key, value]) => {
	// 	if (value) {
	// 		editAddress[key as keyof typeof form.data] = value;
	// 	}
	// });

	const [, editAddressError] = await trytm(
		db
			.update(userAddress)
			.set({ ...address })
			.where(eq(userAddress.userId, sessionUser.id))
	);

	if (editAddressError) {
		// Unexpected-error
		console.error('editAddressError', editAddressError);
		error(500, 'Błąd podczas zmieniania adresu');
	}

	console.log('success');
	return message(form, 'Pomyślnie edytowano adres');
};

export default address;
