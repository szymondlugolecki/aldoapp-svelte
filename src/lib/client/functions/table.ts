import type { CellContext, SortingState } from '@tanstack/svelte-table';
import type { SuperValidated } from 'sveltekit-superforms';
import type { ZodObject } from 'zod';

export const createProps = <
	T extends Record<string, unknown> & { id: string | number },
	Q extends Record<string, never>,
	Y extends SuperValidated<ZodObject<Q>>
>(
	info: CellContext<T, unknown>,
	form: Y
) => {
	const value = info.getValue();
	const label = info.column.columnDef.header;
	const key = info.column.id;

	const item = info.table.options.data.find(
		(item) => item.id === info.row._getAllCellsByColumnId().id.getValue()
	);

	return {
		value,
		label,
		key,
		item,
		form
	};
};

export const setSorting = (
	updater: any,
	sorting: SortingState,
	options: {
		searchParams: URLSearchParams;
		currentPage: number;
	}
) => {
	if (updater instanceof Function) {
		sorting = updater(sorting);
	} else {
		sorting = updater;
	}

	const url = new URLSearchParams(options.searchParams);
	if (sorting && sorting[0]) {
		url.set('sort', sorting[0].id);
		url.set('desc', sorting[0].desc.toString());
		if (url.get('strona')) {
			url.set('strona', options.currentPage.toString());
		}
	}

	return url;
};
