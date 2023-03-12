import { z } from 'zod';
import { emailValidation, verificationCodeValidation } from './users';

export const loginSchema = z.object({
	email: emailValidation
});

export const verificationCodeSchema = z.object({
	code: verificationCodeValidation
});
