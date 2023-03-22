import type { Product } from '@prisma/client';
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

type ProductWithStringImage = Product & {
	images: string[];
};

export type StoreProduct = Pick<
	ProductWithStringImage,
	| 'symbol'
	| 'id'
	| 'images'
	| 'name'
	| 'description'
	| 'category'
	| 'subcategory'
	| 'price'
	| 'weight'
	| 'producent'
	| 'amountLeft'
>;

export type CartProductWithQuantity = Pick<
	ProductWithStringImage,
	'symbol' | 'id' | 'images' | 'name' | 'price' | 'amountLeft'
> & { quantity: number };
