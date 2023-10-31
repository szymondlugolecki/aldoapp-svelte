import { z } from 'zod';
import { discountTypes } from '../constants/dbTypes';

export const code = z
	.string({
		invalid_type_error: 'Nieprawidłowy kod promocyjny',
		required_error: 'Kod promocyjny jest wymagany'
	})
	.min(1, { message: 'Nieprawidłowy kod promocyjny' });

export const minValue = z
	.number({
		invalid_type_error: 'Nieprawidłowa minimalna wartość koszyka',
		required_error: 'Minimalna wartość koszyka jest wymagana'
	})
	.min(1, { message: 'Minimalna wartość koszyka jest wymagana' });

export const discount = z
	.number({
		invalid_type_error: 'Nieprawidłowa wartość rabatu',
		required_error: 'Wartość rabatu jest wymagana'
	})
	.min(1, { message: 'Nieprawidłowa wartość wymagana' });

export const type = z.enum(discountTypes, {
	errorMap(issue) {
		switch (issue.code) {
			case 'invalid_type':
				return { message: 'Nieprawidłowy rodzaj rabatu' };
			case 'invalid_enum_value':
				return { message: 'Nieprawidłowy rodzaj rabatu' };
			default:
				return { message: 'Niespodziewany błąd: rodzaj rabatu' };
		}
	}
});

export const userLimit = z
	.number({
		invalid_type_error: 'Nieprawidłowy limit użyć na klienta',
		required_error: 'Limit dla jednego klienta jest wymagany'
	})
	.min(0, { message: 'Nieprawidłowy limit użyć na klienta' });

export const totalLimit = z
	.number({
		invalid_type_error: 'Nieprawidłowy limit całkowity',
		required_error: 'Limit całkowity jest wymagany'
	})
	.min(0, { message: 'Nieprawidłowy limit całkowity' });

export const validSince = z.date({
	invalid_type_error: 'Nieprawidłowa data rozpoczęcia aktywacji',
	required_error: 'Data rozpoczęcia aktywacji jest wymagana'
});

export const validUntil = z.date({
	invalid_type_error: 'Nieprawidłowa data zakończenia aktywacji',
	required_error: 'Data zakończenia aktywacji jest wymagana'
});

export const form = z.object({
	code,
	minValue,
	discount,
	type,
	userLimit,
	totalLimit,
	validSince,
	validUntil
});
