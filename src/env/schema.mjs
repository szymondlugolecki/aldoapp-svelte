// @ts-check
import { z } from 'zod';

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
	DATABASE_URL: z.string().url(),
	NODE_ENV: z.enum(['development', 'test', 'production']),
	AUTH_SECRET: z.string().min(1),
	EMAIL_PASS: z.string().min(3)
});

/**
 * @type {{ [k in keyof z.input<typeof serverSchema>]: string | undefined }}
 */
export const serverEnv = {
	DATABASE_URL: process.env.DATABASE_URL,
	NODE_ENV: process.env.NODE_ENV,
	AUTH_SECRET: process.env.AUTH_SECRET,
	EMAIL_PASS: process.env.EMAIL_PASS
};

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `PUBLIC_`.
 */
export const clientSchema = z.object({
	// PUBLIC_CLIENTVAR: z.string(),
	PUBLIC_WEBSITE_URL: z.string().url()
});

/**
 * @type {{ [k in keyof z.input<typeof clientSchema>]: string | undefined }}
 */
export const clientEnv = {
	// PUBLIC_CLIENTVAR: process.env.PUBLIC_CLIENTVAR,
	PUBLIC_WEBSITE_URL: process.env.PUBLIC_WEBSITE_URL
};
