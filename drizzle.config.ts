import type { Config } from 'drizzle-kit';
import 'dotenv/config';

console.log('drizzle config db url', process.env.DATABASE_URL);

export default {
	out: './src/lib/server/db/migrations',
	schema: './src/lib/server/db/schemas',
	connectionString: process.env.DATABASE_URL
} satisfies Config;
