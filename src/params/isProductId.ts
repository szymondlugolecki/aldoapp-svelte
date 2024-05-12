import { z } from 'zod';

export const match = (param) => {
	return z.coerce.string().safeParse(param).success;
	// return z.number().min(0).safeParse(param).success;
};
