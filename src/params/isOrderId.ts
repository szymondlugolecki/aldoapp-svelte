import { z } from 'zod';

export const match = (param) => {
	return z.string().safeParse(param).success;
};
