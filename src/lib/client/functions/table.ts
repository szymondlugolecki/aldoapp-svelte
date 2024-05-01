import type { CellContext, SortingState } from '@tanstack/svelte-table';
import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type { AnyZodObject } from 'zod';

export const createProps = <
	T extends Record<string, unknown> & { id: number | string },
	Y extends AnyZodObject
>(
	info: CellContext<T, unknown>,
	form: SuperValidated<Infer<Y>>,
	extraArgs: Record<string, unknown> = {}
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
		form,
		...extraArgs
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
