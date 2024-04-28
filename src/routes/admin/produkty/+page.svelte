<script lang="ts">
	import { cn, dateParser, debounce, flexRender } from '$lib/client/functions';

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
	import TableHyperlink from '$components/custom/Table/TableHyperlink.svelte';

	import AdminEditDialog from '$routes/admin/produkty/(components)/edit-product.svelte';
	import AdminAddDialog from '$routes/admin/produkty/(components)/add-product.svelte';

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
	import { Button } from '$shadcn/button';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PaginationSettings } from '$types';
	import { createProps, setSorting } from '$lib/client/functions/table.js';

	import type { EditProductForm } from '$lib/client/schemas/products.js';
	import { number } from 'zod';
	import Pagination3 from '$components/custom/Pagination3.svelte';
	// import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let data;

	type ParsedProduct = (typeof data.products)[number];

	const defaultColumns: ColumnDef<ParsedProduct>[] = [
		{
			id: 'id',
			accessorKey: 'id',
			enableSorting: false
		},
		{
			id: 'encodedURL',
			header: '',
			accessorKey: 'encodedURL',
			cell: (info) =>
				flexRender(TableHyperlink, { href: `/sklep/${info.getValue()}`, text: 'Sklep' }),
			enableSorting: false
		},
		{
			id: 'name',
			header: 'Nazwa',
			accessorKey: 'name',
			cell: (info) =>
				flexRender(
					AdminEditDialog,
					createProps<ParsedProduct, EditProductForm>(info, data.editForm)
				),
			enableSorting: true
		},
		{
			id: 'symbol',
			header: 'Kod produktu',
			accessorKey: 'symbol',
			cell: (info) =>
				flexRender(
					AdminEditDialog,
					createProps<ParsedProduct, EditProductForm>(info, data.editForm)
				),
			enableSorting: false
		},
		{
			id: 'images',
			header: 'Zdjęcia',
			accessorKey: 'images',
			cell: (info) =>
				flexRender(
					AdminEditDialog,
					createProps<ParsedProduct, EditProductForm>(info, data.editForm)
				),
			enableSorting: false
		},
		{
			id: 'category',
			header: 'Kategoria',
			accessorKey: 'category',
			cell: (info) =>
				flexRender(
					AdminEditDialog,
					createProps<ParsedProduct, EditProductForm>(info, data.editForm)
				),
			enableSorting: true
		},
		{
			id: 'subcategory',
			header: 'Podkategoria',
			accessorKey: 'subcategory',
			cell: (info) =>
				flexRender(
					AdminEditDialog,
					createProps<ParsedProduct, EditProductForm>(info, data.editForm)
				),
			enableSorting: true
		},
		{
			id: 'price',
			header: 'Cena',
			accessorKey: 'price',
			cell: (info) =>
				flexRender(
					AdminEditDialog,
					createProps<ParsedProduct, EditProductForm>(info, data.editForm)
				),
			enableSorting: true
		},
		{
			id: 'weight',
			header: 'Waga',
			accessorKey: 'weight',
			cell: (info) =>
				flexRender(
					AdminEditDialog,
					createProps<ParsedProduct, EditProductForm>(info, data.editForm)
				),
			enableSorting: true
		},
		{
			id: 'producent',
			header: 'Producent',
			accessorKey: 'producent',
			cell: (info) =>
				flexRender(
					AdminEditDialog,
					createProps<ParsedProduct, EditProductForm>(info, data.editForm)
				),
			enableSorting: true
		},
		{
			id: 'description',
			header: 'Opis',
			accessorKey: 'description',
			cell: (info) =>
				flexRender(
					AdminEditDialog,
					createProps<ParsedProduct, EditProductForm>(info, data.editForm)
				),
			enableSorting: false
		},
		{
			id: 'hidden',
			header: 'Ukryty',
			accessorKey: 'hidden',
			cell: (info) =>
				flexRender(
					AdminEditDialog,
					createProps<ParsedProduct, EditProductForm>(info, data.editForm)
				),
			enableSorting: false
		},
		{
			id: 'createdAt',
			header: 'Dodano',
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
			data: data.products
		}));
	};

	const setPage = (pageIndex: number) => {
		currentPage = pageIndex + 1;
		$table.setPageIndex(pageIndex);
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

	$: options = writable<TableOptions<ParsedProduct>>({
		data: data.products,
		columns: defaultColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			columnVisibility: {
				id: false,
				amountLeft: false
			},
			sorting
		},
		enableSorting: true,
		onSortingChange: (updater: any) => {
			const url = setSorting(updater, sorting, {
				currentPage,
				searchParams: $page.url.searchParams
			});
			console.log('url', url);
			goto(`?${url.toString()}`).then(() => {
				options.update((options) => ({
					...options,
					state: {
						...options.state,
						data: data.products,
						sorting
					}
				}));
			});
		},
		onPaginationChange: setPagination,
		manualSorting: true,
		manualPagination: true
	});

	$: table = createSvelteTable(options);
	$: searchParam = $page.url.searchParams.get('szukaj');
	$: pageParam = $page.url.searchParams.get('strona');
	$: currentPage = !isNaN(Number(pageParam)) ? Math.max(Number(pageParam), 1) : 1;

	$: paginationSettings = {
		page: currentPage,
		count: data.count,
		perPage: data.pageLimit,
		defaultPage: 1,
		siblingCount: 1,
		onPageChange: (page) => {
			setPage(page);
		}
	} satisfies PaginationSettings;

	const search = (event: KeyboardEvent) => {
		const input = event.target as HTMLInputElement;
		const queryString = input.value;

		const params = new URLSearchParams($page.url.searchParams.toString());
		params.set('szukaj', queryString);
		params.set('strona', '1');
		goto(`?${params.toString()}`, { keepFocus: true, invalidateAll: true });
	};
</script>

<svelte:head>
	<title>Produkty • Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Lista produktów dostępnych w Twoje ALDO. Dodaj, edytuj lub usuń."
	/>
</svelte:head>

<section class="w-full h-full p-2 space-y-3">
	<div class="flex justify-between space-x-3 lg:space-x-0">
		<Input
			class="max-w-xl"
			type="text"
			placeholder="Wyszukaj..."
			value={searchParam}
			on:keyup={debounce(search, 300)}
			spellcheck={false}
		/>
		{#if data.user?.role === 'admin'}
			<AdminAddDialog form={data.addForm} />
		{/if}
	</div>

	{#key currentPage}
		<Pagination3 bind:paginationSettings />
	{/key}

	<Table>
		<TableCaption>Lista produktów</TableCaption>
		<TableHeader>
			{#each $table.getHeaderGroups() as headerGroup}
				<TableRow>
					{#each headerGroup.headers as header}
						{#if !header.isPlaceholder}
							<TableHead
								class={cn(
									`w-[100px]`,
									header.column.getCanSort() &&
										'cursor-pointer transition-colors hover:bg-muted/10 hover:rounded-md',
									header.column.columnDef.id === 'name' && 'w-[150px]'
								)}
							>
								<!-- <TableSortableHead sortable={header.column.getCanSort()}> -->
								<svelte:component
									this={flexRender(header.column.columnDef.header, header.getContext())}
								/>
								<!-- </TableSortableHead> -->
							</TableHead>
						{/if}
					{/each}
				</TableRow>
			{/each}
		</TableHeader>
		<TableBody>
			{#each $table.getRowModel().rows as row}
				<TableRow>
					{#each row.getVisibleCells() as cell}
						<TableCell class="font-medium"
							><svelte:component
								this={flexRender(cell.column.columnDef.cell, cell.getContext())}
							/></TableCell
						>
					{/each}
				</TableRow>
			{/each}
		</TableBody>
	</Table>

	<Pagination3 {paginationSettings} />
</section>
