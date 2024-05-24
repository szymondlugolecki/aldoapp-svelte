// db.ts
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { DATABASE_URL, DATABASE_SECRET } from '$env/static/private';
// import { generateId } from 'lucia';
import XLSX from 'xlsx';

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
// import { createProduct, createUser } from '../functions/db';
import { productURLParser } from '../functions/utils';
import type { MainCategory } from '$lib/client/constants/dbTypes';
import type { Subcategory } from '$types';
import { productsTable, type InsertProduct } from './schemas/products';

const client = createClient({ url: DATABASE_URL, authToken: DATABASE_SECRET });

export const db = drizzle(client, {
	// logger: true,
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

// const createProgenitorIfNotExists = async () => {
// 	const user = await db.query.usersTable.findFirst({
// 		where: (users, { eq }) => eq(users.email, 'szymon.dlugolecki77@gmail.com')
// 	});
// 	const productsExist = !!(await db.query.productsTable.findFirst());
// 	if (user) {
// 		console.log('Progenitor already exists');

// 		if (!productsExist) {
// 			const encodedURL1 = productURLParser('18 OPTIMAL ECOSAFE/ Big Bag', 'DB5A8X00G-BGB');
// 			const encodedURL2 = productURLParser('18 POWER - W 25kg', 'DB5A3X00G-W25');
// 			const encodedURL3 = productURLParser('20 OPTIMAL - W25 kg', 'DB8N2X00G-W25');
// 			const encodedURL4 = productURLParser('20 POWER - W25 kg', 'DB8C4X00G-W00');

// 			await Promise.all([
// 				createProduct({
// 					authorId: user.id,
// 					name: '18 OPTIMAL ECOSAFE/ Big Bag',
// 					symbol: 'DB5A8X00G-BGB',
// 					category: 'bydlo',
// 					subcategory: 'pasze-krowy-mleczne',
// 					price: 90.5,
// 					weight: 25,
// 					producent: 'deheus',
// 					encodedURL: encodedURL1,
// 					amountLeft: Math.floor(Math.random() * 5)
// 				}),
// 				createProduct({
// 					authorId: user.id,
// 					name: '18 POWER - W 25kg',
// 					symbol: 'DB5A3X00G-W25',
// 					category: 'drob',
// 					subcategory: 'pasze-nioski',
// 					price: 95,
// 					weight: 30,
// 					producent: 'deheus',
// 					encodedURL: encodedURL2,
// 					amountLeft: Math.floor(Math.random() * 5)
// 				}),
// 				createProduct({
// 					authorId: user.id,
// 					name: '20 OPTIMAL - W25 kg',
// 					symbol: 'DB8N2X00G-W25',
// 					category: 'trzoda',
// 					subcategory: 'pasze-tucznik',
// 					price: 100,
// 					weight: 35,
// 					producent: 'deheus',
// 					encodedURL: encodedURL3,
// 					amountLeft: Math.floor(Math.random() * 5)
// 				}),
// 				createProduct({
// 					authorId: user.id,
// 					name: '20 POWER - W25 kg',
// 					symbol: 'DB8C4X00G-W00',
// 					category: 'hodowla-przydomowa',
// 					subcategory: null,
// 					price: 100,
// 					weight: 35,
// 					producent: 'deheus',
// 					encodedURL: encodedURL4,
// 					amountLeft: Math.floor(Math.random() * 5)
// 				})
// 			]);
// 		}

// 		return;
// 	}

// 	await Promise.all([
// 		createUser({
// 			id: generateId(15),
// 			email: 'szymon.dlugolecki78@gmail.com',
// 			fullName: 'Szymon Długołęcki',
// 			role: 'admin',
// 			phone: '997997997'
// 		}),
// 		createUser({
// 			id: generateId(15),
// 			email: 'henryk.sienkiewicz@gmail.com',
// 			fullName: 'Henryk Sienkiewicz',
// 			role: 'customer',
// 			phone: '999999999'
// 		}),
// 		createUser({
// 			id: generateId(15),
// 			email: 'adam.malysz@gmail.com',
// 			fullName: 'Adam Malysz',
// 			role: 'customer',
// 			phone: '998998998'
// 		})
// 	]);

// 	console.log('Progenitor created');
// };

// const addProductsFromExcel = async () => {
// 	const workbook = XLSX.readFile('products.xls');

// 	const worksheet = workbook.Sheets['Towary'];

// 	interface ExcelProduct {
// 		Symbol: string;
// 		Nazwa: string;
// 		Opis: string;
// 		'Nazwa Stawki VAT': string;
// 		'Wartość stawki VAT': number;
// 		JM: string;
// 		PKWiU: string;
// 		Dostawca?: string;
// 		'Cena1 Netto': string;
// 		'Cena1 Brutto': string;
// 		'Cena2 Netto': string;
// 		'Cena2 Brutto': string;
// 		'Cena3 Netto': string;
// 		'Cena3 Brutto': string;
// 		'Cena4 Netto': string;
// 		'Cena4 Brutto': string;
// 		'Cena5 Netto': string;
// 		'Cena5 Brutto': string;
// 		'Cena6 Netto': string;
// 		'Cena6 Brutto': string;
// 		'Cena7 Netto': string;
// 		'Cena7 Brutto': string;
// 		'Cena8 Netto': string;
// 		'Cena8 Brutto': string;
// 		'Cena9 Netto': string;
// 		'Cena9 Brutto': string;
// 		'Cena10 Netto': string;
// 		'Cena10 Brutto': string;
// 	}

// 	const data = XLSX.utils.sheet_to_json(worksheet) as ExcelProduct[];
// 	// console.log('data x', data);

// 	const record = await db.query.usersTable.findFirst({
// 		columns: {
// 			id: true
// 		},
// 		where: (users, { eq }) => eq(users.email, 'szymon.dlugolecki77@gmail.com')
// 	});

// 	if (!record) {
// 		throw new Error('Progenitor not found');
// 	}

// 	const { id: ownerId } = record;

// 	const productsList: InsertProduct[] = [];

// 	data.forEach((product) => {
// 		console.log('price', product['Cena1 Brutto'], parseFloat(product['Cena1 Brutto']));
// 		const price = parseFloat(product['Cena1 Brutto']);
// 		const { Nazwa: name, Opis: description, Symbol: symbol } = product;

// 		let producent: 'deheus' | 'unknown' = 'unknown';
// 		let weight = 0;

// 		// Weight
// 		const nameSqueezed = name.split(' ').join('');
// 		const unitIndex = nameSqueezed.indexOf('kg');
// 		if (unitIndex !== -1) {
// 			let index = unitIndex - 1;
// 			while (!isNaN(Number(nameSqueezed.slice(index, unitIndex)))) {
// 				if (nameSqueezed[index] === '-' || nameSqueezed[index] === '.') {
// 					break;
// 				}
// 				index--;
// 			}

// 			weight = Number(nameSqueezed.slice(index + 1, unitIndex));
// 			// console.log("weight", weight, "kg", name);
// 		}

// 		// Producent
// 		console.log('dostawca', product['Dostawca']);
// 		const dostawca = product['Dostawca'];
// 		if (dostawca === 'DEHEUS') {
// 			producent = 'deheus';
// 		}

// 		// Category
// 		const category = 'bydlo' as MainCategory;
// 		const subcategory = 'pasze-krowy-mleczne' as Subcategory;

// 		const encodedURL = productURLParser(name, symbol);

// 		const insertProduct = {
// 			symbol,
// 			name,
// 			description,
// 			price,
// 			weight,
// 			producent,
// 			category,
// 			subcategory,
// 			amountLeft: 0,
// 			encodedURL,
// 			authorId: ownerId
// 		};

// 		productsList.push(insertProduct);
// 	});

// 	// console.log('productsList', productsList);

// 	await db.insert(productsTable).values(productsList);
// };

// addProductsFromExcel();
// createProgenitorIfNotExists();
