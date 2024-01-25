<script lang="ts">
	import type { BasicUser, PaginationSettings } from '$types';
	import toast from 'svelte-french-toast';
	import type { OrderStatus } from '$lib/client/constants/dbTypes';
	import { cn, dateParser, flexRender } from '$lib/client/functions';
	import TableHyperlink from '$components/custom/Table/TableHyperlink.svelte';

	import {
		createSvelteTable,
		getCoreRowModel,
		getPaginationRowModel,
		type ColumnDef,
		type TableOptions,
		type CellContext,
		type SortingState,
		type Updater,
		type PaginationState
	} from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';
	import Pagination from '$components/custom/Table/Pagination.svelte';
	import AdminEditDialog from '$routes/admin/zamowienia/(components)/edit-order.svelte';

	import * as Table from '$shadcn/table';
	import { Input } from '$shadcn/input';
	import type { Address } from '$lib/server/db/schemas/orders.js';
	import { Button } from '$shadcn/button';
	import { betterZodParse } from '$lib/client/functions/betterZodParse.js';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Pagination2 from '$components/custom/Table/Pagination2.svelte';

	export let data;

	type ParsedOrder = (typeof data.orders)[number];
	let count = data.count[0].count;

	const createOrderProps = (info: CellContext<ParsedOrder, unknown>) => {
		const value = info.getValue();
		// const label = info.column.columnDef.header;
		const key = info.column.id as keyof ParsedOrder;

		const order = info.table.options.data.find(
			(order) => order.id === info.row._getAllCellsByColumnId().id.getValue()
		);

		const forms = {
			statusForm: key === 'status' ? data.eventForm : null,
			addressForm: key === 'address' ? data.addressForm : null,
			paymentForm: key === 'paid' ? data.paymentForm : null
		};

		return {
			value,
			key,
			order,
			...forms
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
		// {
		// 	id: 'paid',
		// 	header: 'Opłacono',
		// 	accessorKey: 'paid',
		// 	cell: (info) => flexRender(AdminEditDialog, createOrderProps(info)),
		// 	enableSorting: true
		// },
		{
			id: 'price',
			header: 'Kwota (z rabatem)',
			accessorKey: 'price',
			cell: (info) => info.getValue(),
			enableSorting: true
		},
		// {
		// 	id: 'discount',
		// 	header: 'Rabat',
		// 	accessorKey: 'discount',
		// 	cell: (info) => info.getValue(),
		// 	enableSorting: true
		// },
		{
			id: 'cartOwner',
			header: 'Zleceniodawca',
			accessorKey: 'cartOwner',
			cell: (info) => (info.getValue() as BasicUser).fullName,
			enableSorting: true
		},
		{
			id: 'customer',
			header: 'Klient',
			accessorKey: 'customer',
			cell: (info) => (info.getValue() as BasicUser).fullName,
			enableSorting: true
		},
		{
			id: 'products',
			header: 'Produkty',
			accessorKey: 'products',
			cell: (info) => {
				const products = info.getValue() as (typeof data.orders)[number]['products'];
				if (!Array.isArray(products)) return '?';
				return '';
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
			cell: (info) => dateParser(info.getValue() as Date, 'medium')
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

	const paginationSettings: PaginationSettings = {
		count,
		perPage: data.pageLimit,
		defaultPage: 1,
		siblingCount: 1
	};
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

	<Table.Root>
		<Table.Caption>Lista zamówień</Table.Caption>
		<Table.Header>
			{#each $table.getHeaderGroups() as headerGroup}
				<Table.Row>
					{#each headerGroup.headers as header}
						{#if !header.isPlaceholder}
							<Table.Head
								class={cn(
									`w-[100px]`,
									header.column.getCanSort() &&
										'cursor-pointer transition-colors hover:bg-muted/10 hover:rounded-md'
								)}
							>
								<svelte:component
									this={flexRender(header.column.columnDef.header, header.getContext())}
								/>
							</Table.Head>
						{/if}
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each $table.getRowModel().rows as row, bodyRowIndex}
				<Table.Row>
					{#each row.getVisibleCells() as cell}
						<Table.Cell class="font-medium whitespace-pre-line"
							><svelte:component
								this={flexRender(cell.column.columnDef.cell, cell.getContext())}
							/></Table.Cell
						>
					{/each}
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<Pagination2 {paginationSettings} />
	<!-- <Pagination {currentPage} {setPage} rowsPerPage={data.pageLimit} totalRows={count} /> -->
</section>
