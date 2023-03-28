import { z } from 'zod';

export const match = (param) => {
	return z.string().uuid().safeParse(param).success;
};
