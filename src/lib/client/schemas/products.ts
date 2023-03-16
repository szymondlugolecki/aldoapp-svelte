import { z } from 'zod';
import {
	MainCategories as MainCategoriesObj,
	type MainCategories as MainCategoriesType
} from '@prisma/client';
import { fodderCategories } from '../constants';

type SubCategories = (typeof fodderCategories)[keyof typeof fodderCategories][number]['id'];

const CATEGORIES: [MainCategoriesType, ...MainCategoriesType[]] = [
	MainCategoriesObj['cattle'],
	...Object.values(MainCategoriesObj).slice(1)
];

const SUBCATEGORIES: [SubCategories, ...SubCategories[]] = [
	fodderCategories['poultry'][0]['id'],
	...Object.values(fodderCategories)
		.map((x) => x.map((y) => y.id))
		.flatMap((x) => x)
];

export const categoryValidation = z.enum(CATEGORIES, {
	errorMap(issue) {
		switch (issue.code) {
			case 'invalid_type':
				return { message: 'Nieprawidłowa kategoria' };
				break;
			case 'invalid_enum_value':
				return { message: 'Nieprawidłowa kategoria' };
				break;
			default:
				return { message: 'Niespodziewany błąd: kategoria' };
				break;
		}
	}
});

export const subcategoryValidation = z
	.enum(SUBCATEGORIES, {
		errorMap(issue) {
			switch (issue.code) {
				case 'invalid_type':
					return { message: 'Nieprawidłowa podkategoria' };
					break;
				case 'invalid_enum_value':
					return { message: 'Nieprawidłowa podkategoria' };
					break;
				default:
					return { message: 'Niespodziewany błąd: podkategoria' };
					break;
			}
		}
	})
	.optional();

export const idValidation = z
	.string({
		required_error: 'Id jest wymagane',
		invalid_type_error: 'Nieprawidłowe id'
	})
	.uuid({ message: 'Nieprawidłowe id' });

export const nameValidation = z
	.string({
		required_error: 'Nazwa produktu jest wymagana',
		invalid_type_error: 'Nieprawidłowa nazwa produktu'
	})
	.min(1, { message: 'Niepoprawna nazwa produktu' })
	.trim();

export const symbolValidation = z
	.string({
		required_error: 'Symbol produktu jest wymagany',
		invalid_type_error: 'Nieprawidłowy symbol produktu'
	})
	.min(1, { message: 'Niepoprawny symbol produktu' })
	.trim();

export const descriptionValidation = z
	.string({ required_error: 'Opis jest wymagany', invalid_type_error: 'Nieprawidłowy opis' })
	.max(256, { message: 'Zbyt długi opis, maksymalnie 256 znaków' })
	.trim();

export const imagesValidation = z
	.array(z.instanceof(File, { message: 'Nieprawidłowy plik' }), {
		invalid_type_error: 'Nieprawidłowe zdjęcia'
	})
	.optional();

export const priceValidation = z
	.number({
		required_error: 'Cena jest wymagana',
		invalid_type_error: 'Nieprawidłowa cena'
	})
	.min(0, { message: 'Niepoprawna cena' });

export const addProductSchema = z.object({
	name: nameValidation,
	symbol: symbolValidation,
	description: descriptionValidation,
	images: imagesValidation,
	category: categoryValidation,
	subcategory: subcategoryValidation,
	price: priceValidation
});

export const editProductSchema = z.object({
	id: idValidation,
	name: nameValidation,
	symbol: symbolValidation,
	description: descriptionValidation,
	images: imagesValidation,
	category: categoryValidation,
	subcategory: subcategoryValidation,
	price: priceValidation
});

export const removeProductSchema = z.object({
	id: idValidation
});
