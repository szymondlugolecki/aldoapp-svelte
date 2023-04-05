import { z } from 'zod';

export const match = (param) => {
	return z.string().min(5).safeParse(param).success;
};
