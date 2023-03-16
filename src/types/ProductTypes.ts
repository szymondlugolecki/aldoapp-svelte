import type { MainCategories, Product } from '@prisma/client';
import type { ProductAuthor } from './UserTypes';
import type { User } from './UserTypes';

export type Category = (typeof MainCategories)[keyof typeof MainCategories];

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
