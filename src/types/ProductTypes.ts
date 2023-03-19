import type { MainCategories, Producent, Product, Image } from '@prisma/client';
import type { ProductAuthor } from './UserTypes';
import type { User } from './UserTypes';
import type { fodderCategories, mainCategories } from '$lib/client/constants';

export type Category = (typeof mainCategories)[number];
export type Subcategory = (typeof fodderCategories)[Category][number]['id'];

export type ProductWithAuthorAndImage = Product & {
	author: ProductAuthor;
	images: ProductImage[];
};

type ProductImage = {
	url: string;
};

export type ProductFilter = {
	excludedUserIds: User['id'][];
	since: string | null;
	until: string | null;
};

export type ProductRowType =
	| 'image'
	| 'name'
	| 'description'
	| 'author'
	| 'action'
	| 'category'
	| 'extra';

export interface FileWithBase64 extends File {
	base64?: string;
}

export type FileInputEvent = Event & {
	currentTarget: EventTarget & HTMLInputElement;
};

export type ImagesList = {
	[id: string]: FileWithBase64;
};

export type StoreProduct = {
	symbol: string;
	id: string;
	images: Image[];
	name: string;
	description: string | null;
	category: MainCategories;
	subcategory: string;
	price: number;
	weight: number;
	producent: Producent;
};
