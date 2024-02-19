// db.ts
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { DATABASE_URL, DATABASE_SECRET } from '$env/static/private';
import { generateId } from 'lucia';

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
import { createProduct, createUser } from '../functions/db';
import { productURLParser } from '../functions/utils';

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

const createProgenitorIfNotExists = async () => {
	const user = await db.query.usersTable.findFirst({
		where: (users, { eq }) => eq(users.email, 'szymon.dlugolecki77@gmail.com')
	});
	const productsExist = !!(await db.query.productsTable.findFirst());
	if (user) {
		console.log('Progenitor already exists');

		if (!productsExist) {
			const encodedURL1 = productURLParser('18 OPTIMAL ECOSAFE/ Big Bag', 'DB5A8X00G-BGB');
			const encodedURL2 = productURLParser('18 POWER - W 25kg', 'DB5A3X00G-W25');
			const encodedURL3 = productURLParser('20 OPTIMAL - W25 kg', 'DB8N2X00G-W25');
			const encodedURL4 = productURLParser('20 POWER - W25 kg', 'DB8C4X00G-W00');

			await Promise.all([
				createProduct({
					authorId: user.id,
					name: '18 OPTIMAL ECOSAFE/ Big Bag',
					symbol: 'DB5A8X00G-BGB',
					category: 'bydlo',
					subcategory: 'pasze-krowy-mleczne',
					price: 90.5,
					weight: 25,
					producent: 'deheus',
					encodedURL: encodedURL1,
					amountLeft: Math.floor(Math.random() * 5)
				}),
				createProduct({
					authorId: user.id,
					name: '18 POWER - W 25kg',
					symbol: 'DB5A3X00G-W25',
					category: 'drob',
					subcategory: 'pasze-nioski',
					price: 95,
					weight: 30,
					producent: 'deheus',
					encodedURL: encodedURL2,
					amountLeft: Math.floor(Math.random() * 5)
				}),
				createProduct({
					authorId: user.id,
					name: '20 OPTIMAL - W25 kg',
					symbol: 'DB8N2X00G-W25',
					category: 'trzoda',
					subcategory: 'pasze-tucznik',
					price: 100,
					weight: 35,
					producent: 'deheus',
					encodedURL: encodedURL3,
					amountLeft: Math.floor(Math.random() * 5)
				}),
				createProduct({
					authorId: user.id,
					name: '20 POWER - W25 kg',
					symbol: 'DB8C4X00G-W00',
					category: 'hodowla-przydomowa',
					subcategory: null,
					price: 100,
					weight: 35,
					producent: 'deheus',
					encodedURL: encodedURL4,
					amountLeft: Math.floor(Math.random() * 5)
				})
			]);
		}

		return;
	}

	await Promise.all([
		createUser({
			id: generateId(15),
			email: 'szymon.dlugolecki78@gmail.com',
			fullName: 'Szymon Długołęcki',
			role: 'admin',
			phone: '997997997'
		}),
		createUser({
			id: generateId(15),
			email: 'henryk.sienkiewicz@gmail.com',
			fullName: 'Henryk Sienkiewicz',
			role: 'customer',
			phone: '999999999'
		}),
		createUser({
			id: generateId(15),
			email: 'adam.malysz@gmail.com',
			fullName: 'Adam Malysz',
			role: 'customer',
			phone: '998998998'
		})
	]);

	console.log('Progenitor created');
};

createProgenitorIfNotExists();

// db.select()
// 	.from(users.usersTable)
// 	.then((allUsers) => console.log('allUsers', allUsers));
// await migrate(db, { migrationsFolder: './src/lib/server/db/migrations' });
