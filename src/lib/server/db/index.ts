// db.ts
import { drizzle } from 'drizzle-orm/planetscale-serverless';
// import { migrate } from 'drizzle-orm/planetscale-serverless/migrator';

import { connect } from '@planetscale/database';
// import { users } from './schemas';
import { DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD } from '$env/static/private';
import * as users from './schemas/users';
import * as userAddress from './schemas/userAddress';
import * as orders from './schemas/orders';
import * as products from './schemas/products';
import * as favoriteProducts from './schemas/favoriteProducts';
import * as orderProducts from './schemas/orderProducts';
import * as orderAddress from './schemas/orderAddress';
import * as carts from './schemas/carts';
import * as cartProducts from './schemas/cartProducts';
// import * as promoCodes from './schemas/promoCodes';
import * as subscriptions from './schemas/subscriptions';
import * as verificationTokens from './schemas/verificationTokens';
import * as images from './schemas/images';

// Create the connection
const connection = connect({
	host: DATABASE_HOST,
	username: DATABASE_USERNAME,
	password: DATABASE_PASSWORD
});

export const db = drizzle(connection, {
	// logger: true,
	schema: {
		...users,
		...userAddress,
		...orders,
		...products,
		...favoriteProducts,
		...orderProducts,
		...orderAddress,
		...carts,
		...cartProducts,
		// ...promoCodes,
		...subscriptions,
		...verificationTokens,
		...images
	}
});

// const allUsers = await db.select().from(users);
// await migrate(db, { migrationsFolder: './src/lib/server/db/migrations' });
