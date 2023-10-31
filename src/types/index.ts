import type { createPagination } from '@melt-ui/svelte';

export * from './ProductTypes';
export * from './UserTypes';
export * from './OrderTypes';
export * from './AuthTypes';
export * from './ApiTypes';
export * from './CartTypes';

export type ShortService =
	| 'pasze'
	| 'komis'
	| 'market'
	| 'paliwa'
	| 'maszyny'
	| 'serwis'
	| 'wulkanizacja';
export type Outlets = 'surowe' | 'myszyniec' | 'ełk' | 'wójtowo';

export type CellTypes = 'text' | 'date' | 'email' | 'checkbox' | 'phone' | 'adviser' | 'role';
export type TableType = 'users' | 'orders' | 'products' | 'promoCodes';

export type PaginationSettings = Parameters<typeof createPagination>[0];
