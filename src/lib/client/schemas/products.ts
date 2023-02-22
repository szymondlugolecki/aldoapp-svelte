import { z } from 'zod';

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

export const thumbnailValidation = z.instanceof(File);
