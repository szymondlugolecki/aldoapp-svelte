<script lang="ts">
	import type { OrderFilter, OrderWithCustomer } from '$types';
	import toast from 'svelte-french-toast';
	import type { OrderStatus } from '$lib/client/constants/dbTypes';
	import { orderStatusList } from '$lib/client/constants/index.js';
	import { cn, dateParser, flexRender } from '$lib/client/functions';
	import TableHyperlink from '$components/Table/TableHyperlink.svelte';

	import {
		createSvelteTable,
		getCoreRowModel,
		getPaginationRowModel,
		type ColumnDef,
		type TableOptions,
		type CellContext,
		type SortingState,
		type SortingColumn,
		type Updater,
		type PaginationState
	} from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';
	import Pagination from '$components/Table/Pagination.svelte';
	import AdminEditDialog from '$components/Dialogs/Admin/Edit/Order.svelte';

	import {
		Table,
		TableBody,
		TableCaption,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$shadcn/table';
	import { Input } from '$shadcn/input';
	import type { Address } from '$lib/server/db/schemas/orders.js';
	import Button from '$shadcn/button/Button.svelte';
	import { betterZodParse } from '$lib/client/functions/betterZodParse.js';
	import TableSortableHead from '$shadcn/table/TableSortableHead.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let data;

	type ParsedOrder = (typeof data.orders)[number];
	$: console.log('orders', data.orders);
	$: count = data.count[0].count;

	const createOrderProps = (info: CellContext<ParsedOrder, unknown>) => {
		const value = info.getValue();
		const keyPublicName = info.column.columnDef.header;
		const key = info.column.id;

		const order = info.table.options.data.find(
			(order) => order.id === info.row._getAllCellsByColumnId().id.getValue()
		);

		return {
			value,
			keyPublicName,
			key,
			order
		};
	};

	const defaultColumns: ColumnDef<ParsedOrder>[] = [
		{
			id: 'id',
			header: 'Szczegóły',
			accessorKey: 'id',
			cell: (info) =>
				flexRender(TableHyperlink, {
					href: `/zamowienia/${info.getValue() as string}`,
					text: 'Sprawdź'
				}),
			enableSorting: false
		},
		{
			id: 'status',
			header: 'Status',
			accessorKey: 'status',
			cell: (info) => flexRender(AdminEditDialog, createOrderProps(info)),
			enableSorting: true
		},
		{
			id: 'deliveryStatus',
			header: 'Dostawa',
			accessorKey: 'deliveryStatus',
			cell: (info) => flexRender(AdminEditDialog, createOrderProps(info)),
			enableSorting: true
		},
		{
			id: 'paymentStatus',
			header: 'Płatność',
			accessorKey: 'paymentStatus',
			cell: (info) => flexRender(AdminEditDialog, createOrderProps(info)),
			enableSorting: true
		},
		{
			id: 'price',
			header: 'Kwota (z rabatem)',
			accessorKey: 'price',
			cell: (info) => info.getValue(),
			enableSorting: true
		},
		{
			id: 'discount',
			header: 'Rabat',
			accessorKey: 'discount',
			cell: (info) => info.getValue(),
			enableSorting: true
		},
		{
			id: 'orderProducts',
			header: 'Produkty',
			accessorKey: 'orderProducts',
			cell: (info) => {
				console.log('info', info.getValue(), typeof info.getValue());
				const products = info.getValue() as (typeof data.orders)[number]['orderProducts'];
				if (!Array.isArray(products)) return '?';

				// 2x'name',

				const parsedProducts = products
					.map((p) => (p.quantity === 1 ? p.product.name : `${p.quantity}x ${p.product.name}`))
					.join(', ');

				return parsedProducts.length > 47 ? parsedProducts.slice(0, 47) + '...' : parsedProducts;
			},
			enableSorting: false
		},
		{
			id: 'address',
			header: 'Adres',
			accessorKey: 'address',
			cell: (info) => flexRender(AdminEditDialog, createOrderProps(info)),
			enableSorting: false
		},
		{
			id: 'createdAt',
			header: 'Złożono',
			accessorKey: 'createdAt',
			cell: (info) => dateParser(info.getValue() as Date, 'short')
		}
	];

	let sorting: SortingState = [];
	let pagination: PaginationState = {
		pageIndex: 0,
		pageSize: data.pageLimit
	};

	const rerender = () => {
		options.update((options) => ({
			...options,
			data: data.orders
		}));
	};

	const setSorting = (updater: any) => {
		if (updater instanceof Function) {
			sorting = updater(sorting);
		} else {
			sorting = updater;
		}

		const url = new URLSearchParams($page.url.searchParams);
		if (sorting && sorting[0]) {
			url.set('sort', sorting[0].id);
			url.set('desc', sorting[0].desc.toString());
			if (url.get('strona')) {
				url.set('strona', currentPage.toString());
			}
		}

		goto(`?${url.toString()}`).then(() => {
			options.update((options) => ({
				...options,
				state: {
					...options.state,
					data: data.orders,
					sorting
				}
			}));
		});
	};

	const setPagination = (updater: Updater<PaginationState>) => {
		if (updater instanceof Function) {
			pagination = updater(pagination);
		} else {
			pagination = updater;
		}

		const url = new URLSearchParams($page.url.searchParams);
		if (pagination) {
			url.set('strona', (pagination.pageIndex + 1).toString());
			goto(`?${url.toString()}`).then(() => rerender());
		}
	};

	let currentPage = 1;

	const setPage = (pageIndex: number) => {
		currentPage = pageIndex + 1;
		console.log('setting page index to', pageIndex);
		$table.setPageIndex(pageIndex);
	};

	$: options = writable<TableOptions<ParsedOrder>>({
		data: data.orders,
		columns: defaultColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			sorting
		},
		enableSorting: true,
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		manualSorting: true,
		manualPagination: true
	});

	$: table = createSvelteTable(options);

	$: pageParam = $page.url.searchParams.get('strona');
	$: currentPage = !isNaN(Number(pageParam)) ? Math.max(Number(pageParam), 1) : 1;
</script>

<svelte:head>
	<title>Zamówienia • Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Lista zamówień złożonych w Twoje ALDO."
	/>
</svelte:head>
<section class="w-full h-full p-2 space-y-3">
	<div class="flex">
		<Input class="max-w-xl" type="text" placeholder="Wyszukaj..." />
	</div>

	<Table>
		<TableCaption>Lista zamówień</TableCaption>
		<TableHeader>
			{#each $table.getHeaderGroups() as headerGroup}
				<TableRow changeBgOnHover={false}>
					{#each headerGroup.headers as header}
						{#if !header.isPlaceholder}
							<TableHead
								onClick={header.column.getToggleSortingHandler()}
								class={cn(
									`w-[100px]`,
									header.column.getCanSort() &&
										'cursor-pointer transition-colors hover:bg-muted/10 hover:rounded-md'
								)}
							>
								<TableSortableHead sortable={header.column.getCanSort()}>
									<svelte:component
										this={flexRender(header.column.columnDef.header, header.getContext())}
									/>
								</TableSortableHead>
							</TableHead>
						{/if}
					{/each}
				</TableRow>
			{/each}
		</TableHeader>
		<TableBody>
			{#each $table.getRowModel().rows as row, bodyRowIndex}
				<TableRow key={bodyRowIndex}>
					{#each row.getVisibleCells() as cell}
						<TableCell class="font-medium whitespace-pre-line"
							><svelte:component
								this={flexRender(cell.column.columnDef.cell, cell.getContext())}
							/></TableCell
						>
					{/each}
				</TableRow>
			{/each}
		</TableBody>
	</Table>

	<Pagination {currentPage} {setPage} rowsPerPage={data.pageLimit} totalRows={count} />
</section>
