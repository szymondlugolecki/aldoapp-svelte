import type { fodderCategories2 } from '$lib/client/constants';
import type { MainCategory, Producent } from '$lib/client/constants/dbTypes';
import type { Product } from '$lib/server/db/schemas/products';

type FodderCategories = typeof fodderCategories2;
type UnionOfKeys<T> = T extends Record<string, any> ? keyof T : never;

export type Category = MainCategory;
export type Subcategory =
	| UnionOfKeys<FodderCategories['bydlo']>
	| UnionOfKeys<FodderCategories['drob']>
	| UnionOfKeys<FodderCategories['trzoda']>
	| UnionOfKeys<FodderCategories['hodowla-przydomowa']>;

export type OrderProduct = Pick<Product, 'id' | 'name' | 'symbol' | 'price' | 'encodedURL'>;

export type ProductSortableColumn = keyof Pick<
	Product,
	'name' | 'price' | 'weight' | 'producent' | 'amountLeft' | 'category' | 'subcategory'
>;

export type ExtendedCategory = MainCategory | 'all';
export type ExtendedSubcategory = Subcategory | 'all';
export type ExtendedProducent = Producent | 'all';
