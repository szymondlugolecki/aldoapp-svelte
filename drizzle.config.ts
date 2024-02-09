import type { Config } from 'drizzle-kit';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_SECRET = process.env.DATABASE_SECRET;

if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is not defined');
}
if (!DATABASE_SECRET) {
	throw new Error('DATABASE_SECRET is not defined');
}

export default {
	out: './src/lib/server/db/migrations',
	schema: './src/lib/server/db/schemas/*',
	driver: 'turso',
	dbCredentials: {
		url: DATABASE_URL,
		authToken: DATABASE_SECRET
	}
} satisfies Config;
