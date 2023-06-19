export * from './ProductTypes';
export * from './UserTypes';
export * from './OrderTypes';
export * from './AuthTypes';
export * from './ApiTypes';
import type { TColumn } from 'gridjs/dist/src/types.js';
import type { Optional } from './UtilityTypes';
import type { Plugin } from 'gridjs/dist/src/plugin';

export type ShortService = 'pasze' | 'komis' | 'market' | 'paliwa' | 'maszyny' | 'serwis';
export type Outlets = 'surowe' | 'myszyniec' | 'ełk' | 'wójtowo';

// type NoIdPlugin = Omit<, 'id' | 'position'>;

export type GridTableColumn = Omit<TColumn, 'plugin'> & {
	plugin?: Optional<Plugin<any>, 'id' | 'position'>;
};

export type CellTypes = 'text' | 'date' | 'email' | 'checkbox' | 'phone' | 'adviser' | 'role';
export type TableType = 'users' | 'orders' | 'products' | 'promoCodes';
