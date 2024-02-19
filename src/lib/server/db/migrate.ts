// db.ts
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
// import { DATABASE_URL, DATABASE_SECRET } from '$env/static/private';
import { migrate } from 'drizzle-orm/libsql/migrator';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_SECRET = process.env.DATABASE_SECRET;

if (!DATABASE_URL || !DATABASE_SECRET) {
	throw new Error('DATABASE_URL or DATABASE_SECRET not found in env');
}

import * as sessions from './schemas/sessions';
import * as users from './schemas/users';
import * as userAddress from './schemas/userAddress';
import * as orders from './schemas/orders';
import * as products from './schemas/products';
import * as favoriteProducts from './schemas/favoriteProducts';
import * as orderProducts from './schemas/orderProducts';
import * as orderAddress from './schemas/orderAddress';
import * as orderStatusLogs from './schemas/orderStatusLogs';
import * as carts from './schemas/carts';
import * as cartProducts from './schemas/cartProducts';
import * as promoCodes from './schemas/promoCodes';
import * as subscriptions from './schemas/subscriptions';
import * as verificationTokens from './schemas/verificationTokens';
import * as images from './schemas/images';
// import { sql } from 'drizzle-orm';

const client = createClient({ url: DATABASE_URL, authToken: DATABASE_SECRET });

export const db = drizzle(client, {
	logger: true,
	schema: {
		...sessions,
		...users,
		...userAddress,
		...orders,
		...products,
		...favoriteProducts,
		...orderProducts,
		...orderAddress,
		...orderStatusLogs,
		...carts,
		...cartProducts,
		...promoCodes,
		...subscriptions,
		...verificationTokens,
		...images
	}
});

// db.run(
// 	sql`SELECT id, hash, created_at FROM "__drizzle_migrations" ORDER BY created_at DESC LIMIT 1`
// )
// 	.execute()
// 	.then((res) => {
// 		console.log('Last migration:', res);
// 	});

// db.query.usersTable.findFirst({ columns: { createdAt: true } }).then((user) => {
// 	console.log('User:', user);
// });

migrate(db, { migrationsFolder: './src/lib/server/db/migrations' })
	.then(() => {
		console.log('Migration successful');
	})
	.catch((err) => {
		console.error('Migration failed', err);
	})
	.finally(() => {
		client.close();
	});
