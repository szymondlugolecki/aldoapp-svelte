import type { Config } from 'drizzle-kit';
import 'dotenv/config';

const dbURL = process.env.DATABASE_URL;

if (!dbURL) {
	throw new Error('DATABASE_URL is not defined');
}

export default {
	out: './src/lib/server/db/migrations',
	schema: './src/lib/server/db/schemas/*',
	driver: 'mysql2',
	dbCredentials: {
		connectionString: dbURL
	}
} satisfies Config;
