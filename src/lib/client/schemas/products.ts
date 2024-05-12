import { z } from 'zod';
import { fodderCategories2 } from '../constants';
import type { Category, Subcategory } from '$types';
import { mainCategories, producents, type Producent } from '../constants/dbTypes';

const PRODUCENTS: [Producent, ...Producent[]] = [producents[0], ...producents.slice(1)];
const CATEGORIES: [Category, ...Category[]] = [mainCategories[0], ...mainCategories.slice(1)];
const SUBCATEGORIES: [Subcategory, ...Subcategory[]] = [
	(Object.keys(fodderCategories2['bydlo']) as (keyof (typeof fodderCategories2)['bydlo'])[])[0],
	...(Object.values(fodderCategories2).flatMap((x) => Object.keys(x)) as Subcategory[])
];

export const id = z
	.number({
		invalid_type_error: 'Nieprawidłowe id produktu',
		required_error: 'Id produktu jest wymagane'
	})
	.min(0, { message: 'Nieprawidłowe id produktu' });

export const category = z.enum(CATEGORIES, {
	errorMap(issue) {
		switch (issue.code) {
			case 'invalid_type':
				return { message: 'Nieprawidłowa kategoria' };
			case 'invalid_enum_value':
				return { message: 'Nieprawidłowa kategoria' };
			default:
				return { message: 'Niespodziewany błąd: kategoria' };
		}
	}
});

export const subcategory = z.enum(SUBCATEGORIES, {
	errorMap(issue) {
		switch (issue.code) {
			case 'invalid_type':
				return { message: 'Nieprawidłowa podkategoria' };
			case 'invalid_enum_value':
				return { message: 'Nieprawidłowa podkategoria' };
			default:
				return { message: 'Niespodziewany błąd: podkategoria' };
		}
	}
});

export const name = z
	.string({
		invalid_type_error: 'Nieprawidłowa nazwa produktu',
		required_error: 'Nazwa produktu jest wymagana'
	})
	.min(1, { message: 'Nieprawidłowa nazwa produktu' })
	.trim();

export const symbol = z
	.string({
		required_error: 'Symbol produktu jest wymagany',
		invalid_type_error: 'Nieprawidłowy symbol produktu'
	})
	.min(1, { message: 'Nieprawidłowy symbol produktu' })
	.trim();

export const description = z
	.string({ invalid_type_error: 'Nieprawidłowy opis', required_error: 'Opis jest wymagany' })
	.max(4096, { message: 'Zbyt długi opis, maksymalnie 4096 znaków' })
	.trim();

export const price = z.coerce
	.number({
		invalid_type_error: 'Nieprawidłowa cena',
		required_error: 'Cena jest wymagana'
	})
	.min(0, { message: 'Nieprawidłowa cena' });

export const weight = z.coerce
	.number({
		invalid_type_error: 'Nieprawidłowa waga',
		required_error: 'Waga jest wymagana'
	})
	.min(0, { message: 'Nieprawidłowa waga' });

export const producent = z.enum(PRODUCENTS, {
	errorMap(issue) {
		switch (issue.code) {
			case 'invalid_type':
				return { message: 'Nieprawidłowy producent' };
			case 'invalid_enum_value':
				return { message: 'Nieprawidłowy producent' };
			default:
				return { message: 'Niespodziewany błąd: producent' };
		}
	}
});

const MAX_FILE_SIZE = 5_000_000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE = 5_000_000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];

export const image = z
	.instanceof(File, { message: 'Wymagane jest jedno zdjęcie' })
	.refine((f) => f.size <= MAX_FILE_SIZE, 'Maksymalny rozmiar zdjęcia to 5 MB')
	.refine(
		(f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
		'Dozwolone formaty: jpg, jpeg, png, webp, avif.'
	);

// z
// 	.any()
// 	.refine((files) => files?.length <= 1, 'Wymagane jest jedno zdjęcie.')
// 	.refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Maksymalny rozmiar zdjęcia to 5MB.`)
// 	.refine(
// 		(files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
// 		'Dozwolone formaty: jpg, jpeg, png, webp, avif.'
// 	);

export const hidden = z.boolean({
	invalid_type_error: 'Nieprawidłowa wartość dla: ukryty',
	required_error: 'Wymagana wartość dla: ukryty'
});

export const addForm = z.object({
	name,
	symbol,
	category,
	subcategory: subcategory.optional(),
	price,
	weight
	// producent
});

export const editForm = z.object({
	id,
	name: name.optional(),
	symbol: symbol.optional(),
	description: description.optional().nullable(),
	category: category.optional(),
	subcategory: subcategory.optional(),
	price: price.optional(),
	weight: weight.optional(),
	producent: producent.optional(),
	images: image.optional(),
	hidden: hidden.optional()
});

export type AddProductForm = typeof addForm;
export type EditProductForm = typeof editForm;
