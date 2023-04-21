export * from './ProductTypes';
export * from './UserTypes';
export * from './OrderTypes';
export * from './AuthTypes';
export * from './ApiTypes';
import type { ComponentType } from 'svelte';

export type ShortService = 'pasze' | 'komis' | 'market' | 'paliwa' | 'maszyny' | 'serwis';
export type Outlets = 'surowe' | 'myszyniec' | 'ełk' | 'wójtowo';

export type GridTableColumn = {
	key: string;
	label?: string;
	hidden?: boolean;
	formatter?: (cell: any) => string;
	sort?: boolean;
	editableType?: 'text' | 'date' | 'access' | 'user' | 'role' | 'category';
	component?: ComponentType;
};

export type DrawerStore =
	| {
			type: 'user' | 'product' | 'promoCode';
			open: boolean;
			action: 'add' | 'filter';
	  }
	| {
			type: 'product';
			open: boolean;
			id: number;
			action: 'edit' | 'remove';
	  }
	| {
			type: 'user';
			open: boolean;
			id: string;
			action: 'edit' | 'remove';
	  }
	| {
			type: 'user';
			open: boolean;
			action: 'filter';
	  }
	| {
			type: 'order' | 'promoCode';
			open: boolean;
			id: number;
			action: 'edit';
	  }
	| {
			type: 'order';
			open: boolean;
			action: 'filter';
	  };
