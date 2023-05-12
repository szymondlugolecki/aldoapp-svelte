export * from './ProductTypes';
export * from './UserTypes';
export * from './OrderTypes';
export * from './AuthTypes';
export * from './ApiTypes';
import type { html, Row } from 'gridjs';
import type { TCell, TColumn } from 'gridjs/dist/src/types';
import type { ComponentType } from 'svelte';

export type ShortService = 'pasze' | 'komis' | 'market' | 'paliwa' | 'maszyny' | 'serwis';
export type Outlets = 'surowe' | 'myszyniec' | 'ełk' | 'wójtowo';

export type GridTableColumn = {
	id?: string;
	data?: any;
	name: string;
	width?: string;
	sort?: boolean;
	hidden?: boolean;
	formatter?: (
		cell: TCell,
		row: Row,
		column: TColumn
	) => ComponentType | ReturnType<typeof html> | string;
	attributes?: (cell: TCell, row: Row, column: TColumn) => any;
};

export type CellTypes = 'text' | 'date' | 'email' | 'checkbox' | 'phone' | 'adviser' | 'role';
export type TableType = 'users' | 'orders' | 'products' | 'promoCodes';
