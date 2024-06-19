<script lang="ts">
	import { cn, dateParser, debounce, flexRender, getSubcategoryName } from '$lib/client/functions';

	import {
		createSvelteTable,
		getCoreRowModel,
		getPaginationRowModel,
		type ColumnDef,
		type TableOptions,
		type CellContext,
		type Updater,
		type PaginationState
	} from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';
	// import TableHyperlink from '$components/custom/table/table-hyperlink.svelte';
	import TableHyperlink from '$components/custom/table/table-hyperlink.svelte';

	import AdminAddDialog from './(components)/add-product.svelte';

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
	import type { BasicUser, ExtendedSubcategory, PaginationSettings } from '$types';

	import Pagination from '$components/custom/table/pagination.svelte';
	import ProductMiniProfile from './(components)/product-mini-profile.svelte';
	import { fodderNames, producentsList } from '$lib/client/constants';
	import type { Producent } from '$lib/client/constants/dbTypes';
	// import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let data;

	type ParsedProduct = (typeof data.products)[number];

	const defaultColumns: ColumnDef<ParsedProduct>[] = [
		{
			header: 'Akcja',
			accessorKey: 'id',
			cell: (info) =>
				flexRender(TableHyperlink, {
					href: `/admin/produkty/edit/${info.getValue()}`,
					text: 'Edytuj'
				}),
			footer: (info) => info.column.id
		},
		{
			header: 'Produkt',
			accessorKey: 'name',
			cell: (info) => flexRender(ProductMiniProfile, { info })
		},
		{
			header: 'Kategoria',
			accessorKey: 'category',
			accessorFn: (product) =>
				`• ${fodderNames[product.category]}${
					product.subcategory
						? '\n• ' +
						  getSubcategoryName(product.category, product.subcategory as ExtendedSubcategory)
						: ''
				}`
		},
		{
			header: 'Waga',
			accessorKey: 'weight',
			cell: (info) => `${Number(info.getValue()).toFixed(2)} kg`
		},
		{
			header: 'Producent',
			accessorKey: 'producent',
			cell: (info) => producentsList[info.getValue() as Producent]
		},
		{
			header: 'Ukryty',
			accessorKey: 'hidden',
			cell: (info) => (info.getValue() === true ? 'Tak' : 'Nie')
		},
		{
			header: 'Dodał(a)',
			accessorKey: 'createdAt',
			accessorFn: (product) =>
				`${product.author.fullName}\n${dateParser(product.createdAt, 'medium')}`
		}
	];

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
				amountLeft: false
			}
		},
		onPaginationChange: setPagination,
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
		{#if data.me?.role === 'admin'}
			<AdminAddDialog superform={data.addForm} />
		{/if}
	</div>

	{#key currentPage}
		<Pagination bind:paginationSettings />
	{/key}

	<Table>
		<TableCaption>Lista produktów</TableCaption>
		<TableHeader>
			{#each $table.getHeaderGroups() as headerGroup}
				<TableRow>
					{#each headerGroup.headers as header}
						{#if !header.isPlaceholder}
							<TableHead
								class={cn(`w-[100px]`, header.column.columnDef.id === 'name' && 'w-[150px]')}
							>
								<svelte:component
									this={flexRender(header.column.columnDef.header, header.getContext())}
								/>
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

	<Pagination bind:paginationSettings />
</section>
