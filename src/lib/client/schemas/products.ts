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
	required_error: 'Kategoria jest wymagana',
	invalid_type_error: 'Nieprawidłowa kategoria'
});

// console.log('XD', categoryValidation.safeParse('cattle'));

export const subcategoryValidation = z.enum(SUBCATEGORIES, {
	required_error: 'Podkategoria jest wymagana',
	invalid_type_error: 'Nieprawidłowa podkategoria'
});

export const idValidation = z
	.string({
		required_error: 'Id jest wymagane'
	})
	.uuid({ message: 'Nieprawidłowe id' });

export const nameValidation = z
	.string({
		required_error: 'Nazwa produktu jest wymagana'
	})
	.min(1, { message: 'Niepoprawna nazwa produktu' })
	.trim();

export const symbolValidation = z
	.string({
		required_error: 'Symbol produktu jest wymagany'
	})
	.min(1, { message: 'Niepoprawny symbol produktu' })
	.trim();

export const descriptionValidation = z
	.string()
	.max(256, { message: 'Zbyt długi opis, maksymalnie 256 znaków' })
	.trim();

export const imagesValidation = z
	.array(z.instanceof(File, { message: 'Nieprawidłowy plik' }), {
		invalid_type_error: 'Nieprawidłowe zdjęcia'
	})
	.optional();
// type Images = z.infer<typeof imagesValidation>;

export const addProductSchema = z.object({
	name: nameValidation,
	symbol: symbolValidation,
	description: descriptionValidation,
	images: imagesValidation,
	category: categoryValidation,
	subcategory: subcategoryValidation
});

export const editProductSchema = z.object({
	id: idValidation,
	name: nameValidation,
	symbol: symbolValidation,
	description: descriptionValidation,
	images: imagesValidation,
	category: categoryValidation,
	subcategory: subcategoryValidation
});

export const removeProductSchema = z.object({
	id: idValidation
});
