import { betterZodParse } from '$lib/client/functions/betterZodParse';
import { errorResponses } from '$lib/client/constants/errorResponses';
// import { p } from '$lib/server/clients/pClient';
import { trytm } from '@bdsqqq/try';
import { error, fail, type Action } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { addPromoCodeValidation } from '$lib/client/schemas/promoCode';
import { promoCodes, type PromoCode } from '$lib/server/db/schemas/promoCodes';

const stringToDateParser = (value: FormDataEntryValue | null) => {
	if (value === null) {
		return undefined;
	}
	const date = new Date(value.toString());
	if (isNaN(date.getTime())) {
		return undefined;
	}
	return date;
};

const add = (async ({ request, locals }) => {
	// Only moderators and admins are allowed to add a promo code
	if (!locals.session) {
		throw error(...errorResponses[401]);
	}
	if (!['admin', 'moderator'].includes(locals.session?.user.role)) {
		throw error(...errorResponses[403]);
	}

	// Validate the user input
	const [formData, formDataError] = await trytm(request.formData());
	if (formDataError) {
		return fail(400, {
			errors: ['Niepoprawne dane']
		});
	}

	const validSince = stringToDateParser(formData.get('validSince'));
	const validUntil = stringToDateParser(formData.get('validUntil'));

	console.log(validSince, validUntil);

	if (!validSince) {
		return fail(400, {
			errors: ['Niepoprawna data rozpoczęcia aktywacji']
		});
	}

	if (!validUntil) {
		return fail(400, {
			errors: ['Niepoprawna data rozpoczęcia aktywacji']
		});
	}

	const data = {
		...Object.fromEntries(formData),
		discount: Number(formData.get('discount')?.toString().replace(',', '.')),
		totalUseLimit: Number(formData.get('totalUseLimit')?.toString().replace(',', '.')),
		perUserLimit: Number(formData.get('perUserLimit')?.toString().replace(',', '.')),
		minCartValue: Number(formData.get('minCartValue')?.toString().replace(',', '.')),
		validSince,
		validUntil
	};

	console.log('data', data);

	if (isNaN(data.discount)) {
		return fail(400, {
			errors: ['Niepoprawna wartość przeceny']
		});
	}
	if (isNaN(data.totalUseLimit)) {
		return fail(400, {
			errors: ['Niepoprawny całkowity limit użycia kodu']
		});
	}

	if (isNaN(data.perUserLimit)) {
		return fail(400, {
			errors: ['Niepoprawny limit użycia kodu na użytkownika']
		});
	}

	if (isNaN(data.minCartValue)) {
		return fail(400, {
			errors: ['Niepoprawna minimalna wartość koszyka']
		});
	}

	const [newPromoCodeParsed, newCodeParseError] = betterZodParse(addPromoCodeValidation, data);
	if (newCodeParseError) {
		return fail(400, {
			errors: [newCodeParseError[0]]
		});
	}

	console.log('newPromoCodeParsed', newPromoCodeParsed);

	const newPromoCode = {
		...newPromoCodeParsed,
		authorId: locals.session.user.id,
		enabled: true,
		applicableProducts: []
	} satisfies Omit<PromoCode, 'createdAt' | 'id'>;

	// Add the promo code to the database
	const [, addCodeError] = await trytm(db.insert(promoCodes).values(newPromoCode));

	if (addCodeError) {
		// Unexpected-error
		console.error('addCodeError', addCodeError);
		return fail(500, {
			errors: ['Nie udało się dodać kodu rabtowego']
		});
	}

	return { success: true, message: 'Pomyślnie dodano kod rabatowy' };
}) satisfies Action;

export default add;
