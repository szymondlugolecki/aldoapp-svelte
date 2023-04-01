export * from './ProductTypes';
export * from './UserTypes';
export * from './AuthTypes';
export * from './ApiTypes';

export type ShortService = 'pasze' | 'komis' | 'market' | 'paliwa' | 'maszyny' | 'serwis';
export type Outlets = 'surowe' | 'myszyniec' | 'ełk' | 'wójtowo';

export type DrawerStore =
	| {
			open: boolean;
			type: 'user' | 'product';
			action: 'add' | 'filter';
	  }
	| {
			open: boolean;
			id: number;
			type: 'user' | 'product';
			action: 'edit' | 'remove';
	  };
