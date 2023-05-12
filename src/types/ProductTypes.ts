import type { ProductAuthor } from './UserTypes';
import type { User } from './UserTypes';
import type { fodderCategories } from '$lib/client/constants';
import type { MainCategory } from '$lib/client/constants/dbTypes';
import type { Product } from '$lib/server/db/schemas/products';

export type Category = MainCategory;
export type Subcategory = (typeof fodderCategories)[Category][number]['id'];

export type ProductWithAuthorAndImage = Product & {
	author: ProductAuthor;
	images: string[];
};

export type ProductFilter = {
	excludedUserIds: User['id'][];
	createdSince: string | null;
	createdUntil: string | null;
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
	| 'encodedURL'
>;

export type CartProductWithQuantity = Pick<
	ProductWithStringImage,
	'symbol' | 'id' | 'images' | 'name' | 'price' | 'amountLeft' | 'encodedURL'
> & { quantity: number };

export type CartProduct = Pick<
	Product,
	'id' | 'name' | 'symbol' | 'price' | 'images' | 'amountLeft' | 'encodedURL'
>;
