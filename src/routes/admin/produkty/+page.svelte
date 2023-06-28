<script lang="ts">
	import { cn, dateParser, flexRender } from '$lib/client/functions';
	import type { ProductFilter, Subcategory } from '$types';
	import { imagesSorting } from '$lib/client/functions/sorting';
	import type { MainCategory, Producent } from '$lib/client/constants/dbTypes.js';
	import {
		fodderCategories,
		fodderCategories2,
		fodderNames,
		producentsList
	} from '$lib/client/constants/index.js';

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
	import TableHyperlink from '$components/Table/TableHyperlink.svelte';

	import AdminProductEditDialog from '$components/Dialogs/Admin/Edit/Product.svelte';
	import AdminAddDialog from '$components/Dialogs/Admin/Add/Product.svelte';

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
	import TableSortableHead from '$shadcn/table/TableSortableHead.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { Image } from '$lib/server/db/schemas/images.js';

	export let data;

	$: console.log('products', data.products);
	$: count = data.count[0].count;

	// const dataProductsSorted = data.products
	// 	.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
	// 	.map((product) => {
	// 		return {
	// 			...product,
	// 			images: product.images.sort(imagesSorting)
	// 		};
	// 	});

	// Final list of products filtered by the input from the searchbar, etc.
	// $: products = applyProductFilters(dataProductsSorted, filter, searchInput);

	// let product: ProductWithAuthorAndImage | undefined;

	const createProductProps = (
		info: CellContext<ParsedProduct, unknown>,
		cellTextOverride?: string
	) => {
		const cellValue = info.getValue();
		const keyPublicName = info.column.columnDef.header;
		const key = info.column.id;
		const elementId = info.row._getAllCellsByColumnId().id.getValue();

		return {
			cellValue,
			keyPublicName,
			key,
			cellTextOverride,
			elementId
		};
	};

	// id, link, produkt, zdjecia, cena, dodatkowe informacje, kategorie, opis, dodany

	const subCategoriesList = Object.values(fodderCategories2).reduce<Record<Subcategory, string>>(
		(acc, curr) => {
			acc = { ...acc, ...curr };
			return acc;
		},
		{} as Record<Subcategory, string>
	);

	const defaultColumns: ColumnDef<ParsedProduct>[] = [
		{
			id: 'id',
			accessorKey: 'id',
			enableSorting: false
		},
		{
			id: 'encodedURL',
			header: 'Podgląd',
			accessorKey: 'encodedURL',
			cell: (info) =>
				flexRender(TableHyperlink, { href: `/sklep/${info.getValue()}`, text: 'Sprawdź' }),
			enableSorting: false
		},
		{
			id: 'name',
			header: 'Nazwa',
			accessorKey: 'name',
			cell: (info) => flexRender(AdminProductEditDialog, createProductProps(info)),
			enableSorting: true
		},
		{
			id: 'symbol',
			header: 'Kod produktu',
			accessorKey: 'symbol',
			cell: (info) => flexRender(AdminProductEditDialog, createProductProps(info)),
			enableSorting: false
		},
		{
			id: 'imagesId',
			header: 'Zdjęcia',
			accessorKey: 'imagesId',
			cell: (info) =>
				flexRender(
					AdminProductEditDialog,
					createProductProps(
						info,
						info.getValue() ? `${(info.getValue() as Image[]).length} zdjęć` : 'Brak'
					)
				),
			enableSorting: false
		},
		{
			id: 'category',
			header: 'Kategoria',
			accessorKey: 'category',
			cell: (info) =>
				flexRender(
					AdminProductEditDialog,
					createProductProps(info, fodderNames[info.getValue() as MainCategory])
				),
			enableSorting: true
		},
		{
			id: 'subcategory',
			header: 'Podkategoria',
			accessorKey: 'subcategory',
			cell: (info) =>
				flexRender(
					AdminProductEditDialog,
					createProductProps(info, subCategoriesList[info.getValue() as Subcategory] || '-')
				),
			enableSorting: true
		},
		{
			id: 'price',
			header: 'Cena',
			accessorKey: 'price',
			cell: (info) => flexRender(AdminProductEditDialog, createProductProps(info)),
			enableSorting: true
		},
		{
			id: 'weight',
			header: 'Waga',
			accessorKey: 'weight',
			cell: (info) => flexRender(AdminProductEditDialog, createProductProps(info)),
			enableSorting: true
		},
		{
			id: 'producent',
			header: 'Producent',
			accessorKey: 'producent',
			cell: (info) =>
				flexRender(
					AdminProductEditDialog,
					createProductProps(info, producentsList[info.getValue() as Producent])
				),
			enableSorting: true
		},
		{
			id: 'description',
			header: 'Opis',
			accessorKey: 'description',
			cell: (info) => flexRender(AdminProductEditDialog, createProductProps(info, '...')),
			enableSorting: false
		},
		{
			id: 'createdAt',
			header: 'Dodano',
			accessorKey: 'createdAt',
			cell: (info) => dateParser(info.getValue() as Date, 'short')
		}
	];

	type ParsedProduct = (typeof data.products)[number];

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
					data: data.products,
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
	<title>Produkty • Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Lista produktów dostępnych w Twoje ALDO. Dodaj, edytuj lub usuń."
	/>
</svelte:head>

<section class="w-full h-full p-2 space-y-3">
	<!-- <div class="collapse border border-base-300 rounded-box">
		<input type="checkbox" />
		<div class="collapse-title text-xl font-medium">Filtrowanie</div>
		<div class="collapse-content">
			<div class="space-y-0.5">
				<span class="block label">Data utworzenia</span>

				<div class="grid grid-cols-1 xs:grid-cols-3 gap-2">
					<div class="w-full">
						<label for="joined-date-from" class="block text-sm text-base-content">Od</label>
						<input
							class="w-full sm:w-auto p-2 rounded-md"
							type="date"
							name="joined-date-from"
							bind:value={filter.createdSince}
						/>
					</div>
					<div class="w-full">
						<label for="joined-date-to" class="block text-sm text-base-content">Do</label>
						<input
							type="date"
							name="joined-date-to"
							class="w-full sm:w-auto p-2 rounded-md"
							bind:value={filter.createdUntil}
						/>
					</div>
				</div>
			</div>
		</div>
	</div> -->

	<div class="flex justify-between space-x-3 lg:space-x-0">
		<Input class="max-w-xl" type="text" placeholder="Wyszukaj..." />
		<Button variant="secondary"><AdminAddDialog /></Button>
	</div>

	<Table>
		<TableCaption>Lista produktów</TableCaption>
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
										'cursor-pointer transition-colors hover:bg-muted/10 hover:rounded-md',
									header.column.columnDef.id === 'name' && 'w-[150px]'
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

	<Pagination {currentPage} {setPage} rowsPerPage={data.pageLimit} totalRows={count} />
</section>
