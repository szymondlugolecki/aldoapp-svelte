import { z } from 'zod';
import { discountTypes } from '../constants/dbTypes';

export const addPromoCodeValidation = z.object({
	code: z
		.string({
			invalid_type_error: 'Nieprawidłowy kod promocyjny',
			required_error: 'Kod promocyjny jest wymagany'
		})
		.min(1, { message: 'Nieprawidłowy kod promocyjny' }),
	minCartValue: z
		.string({
			invalid_type_error: 'Nieprawidłowa minimalna wartość koszyka',
			required_error: 'Minimalna wartość koszyka jest wymagana'
		})
		.min(1, { message: 'Minimalna wartość koszyka jest wymagana' }),
	discount: z
		.string({
			invalid_type_error: 'Nieprawidłowa wartość rabatu',
			required_error: 'Wartość rabatu jest wymagana'
		})
		.min(1, { message: 'Minimalna wartość rabatu jest wymagana' }),
	discountType: z.enum(discountTypes, {
		errorMap(issue) {
			switch (issue.code) {
				case 'invalid_type':
					return { message: 'Nieprawidłowy rodzaj przeceny' };
					break;
				case 'invalid_enum_value':
					return { message: 'Nieprawidłowy rodzaj przeceny' };
					break;
				default:
					return { message: 'Niespodziewany błąd: rodzaj przeceny' };
					break;
			}
		}
	}),
	perUserLimit: z
		.number({
			invalid_type_error: 'Nieprawidłowy limit dla jednego klienta',
			required_error: 'Limit dla jednego klienta jest wymagany'
		})
		.min(0, { message: 'Limit dla jednego klienta nie może być ujemny' }),
	totalUseLimit: z
		.number({
			invalid_type_error: 'Nieprawidłowy limit całkowity',
			required_error: 'Limit całkowity jest wymagany'
		})
		.min(0, { message: 'Limit całkowity nie może być ujemny' }),
	validSince: z.date({
		invalid_type_error: 'Nieprawidłowa data rozpoczęcia aktywacji',
		required_error: 'Data rozpoczęcia aktywacji jest wymagana'
	}),
	validUntil: z.date({
		invalid_type_error: 'Nieprawidłowa data zakończenia aktywacji',
		required_error: 'Data zakończenia aktywacji jest wymagana'
	})
});
