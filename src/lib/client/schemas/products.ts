import { z } from 'zod';
// import {
// 	MainCategories as MainCategoriesObj,
// 	type MainCategories as MainCategoriesType
// } from '@prisma/client';
// import { fodderCategories } from '../constants';

// type SubCategories = (typeof fodderCategories)[keyof typeof fodderCategories][number]['id'];

// const CATEGORIES: [MainCategoriesType, ...MainCategoriesType[]] = [
// 	MainCategoriesObj['cattle'],
// 	...Object.values(MainCategoriesObj).slice(1)
// ];

// const SUBCATEGORIES: [SubCategories, ...SubCategories[]] = [
// 	fodderCategories['poultry'][0]['id'],
// 	...Object.values(fodderCategories)
// 		.flatMap((x) => x)
// 		.map((x) => x.id)
// ];

// export const categoryValidation = z.enum(CATEGORIES, {
// 	required_error: 'Kategoria jest wymagana',
// 	invalid_type_error: 'Nieprawidłowa kategoria'
// });

// console.log('XD', categoryValidation.safeParse('cattle'));

// export const subCategoryValidation = z.string({
// 	required_error: 'Podkategoria jest wymagana'
// });

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

export const thumbnailValidation = z.instanceof(File).optional();

export const addProductSchema = z.object({
	name: nameValidation,
	symbol: symbolValidation,
	description: descriptionValidation,
	thumbnail: thumbnailValidation
	// category:
});

export const editProductSchema = z.object({
	id: idValidation,
	name: nameValidation,
	symbol: symbolValidation,
	description: descriptionValidation,
	thumbnail: thumbnailValidation
});

export const removeProductSchema = z.object({
	id: idValidation
});
