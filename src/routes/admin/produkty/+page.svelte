<script lang="ts">
	import { cn, dateParser, flexRender } from '$lib/client/functions';

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
	import Pagination2 from '$components/custom/Table/Pagination2.svelte';
	import type { PaginationSettings } from '$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { createProps, setSorting } from '$lib/client/functions/table.js';

	import * as LR from '@uploadcare/blocks';
	import { PACKAGE_VERSION } from '@uploadcare/blocks';
	import type { EditProductForm } from '$lib/client/schemas/products.js';

	LR.registerBlocks(LR);

	let files = [];
	function handleUploaderEvent(e) {
		const { data } = e.detail;
		files = data;
	}

	export let data;

	const { count } = data.count[0];
	// const { form, errors, enhance, message } = superForm(data.addForm, {
	// 	resetForm: true
	// });

	// const {
	// 	form: registerForm,
	// 	errors: registerErrors,
	// 	enhance: registerEnhance,
	// 	message: registerMessage
	// } = superForm(data.editForm, {
	// 	resetForm: true
	// });

	type ParsedProduct = (typeof data.products)[number];

	const defaultColumns: ColumnDef<ParsedProduct>[] = [
		{
			id: 'id',
			accessorKey: 'id',
			enableSorting: false
		},
		{
			id: 'encodedURL',
			header: 'Sklep',
			accessorKey: 'encodedURL',
			cell: (info) =>
				flexRender(TableHyperlink, { href: `/sklep/${info.getValue()}`, text: 'Sklep' }),
			enableSorting: false
		},
		{
			id: 'name',
			header: 'Nazwa',
			accessorKey: 'name',
			cell: (info) => flexRender(AdminEditDialog, createProps<ParsedProduct>(info, data.editForm)),
			enableSorting: true
		},
		{
			id: 'symbol',
			header: 'Kod produktu',
			accessorKey: 'symbol',
			cell: (info) => flexRender(AdminEditDialog, createProps<ParsedProduct>(info, data.editForm)),
			enableSorting: false
		},
		{
			id: 'images',
			header: 'Zdjęcia',
			accessorKey: 'images',
			cell: (info) => flexRender(AdminEditDialog, createProps<ParsedProduct>(info, data.editForm)),
			enableSorting: false
		},
		{
			id: 'category',
			header: 'Kategoria',
			accessorKey: 'category',
			cell: (info) => flexRender(AdminEditDialog, createProps<ParsedProduct>(info, data.editForm)),
			enableSorting: true
		},
		{
			id: 'subcategory',
			header: 'Podkategoria',
			accessorKey: 'subcategory',
			cell: (info) => flexRender(AdminEditDialog, createProps<ParsedProduct>(info, data.editForm)),
			enableSorting: true
		},
		{
			id: 'price',
			header: 'Cena',
			accessorKey: 'price',
			cell: (info) => flexRender(AdminEditDialog, createProps<ParsedProduct>(info, data.editForm)),
			enableSorting: true
		},
		{
			id: 'weight',
			header: 'Waga',
			accessorKey: 'weight',
			cell: (info) => flexRender(AdminEditDialog, createProps<ParsedProduct>(info, data.editForm)),
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
	<title>Produkty • Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Lista produktów dostępnych w Twoje ALDO. Dodaj, edytuj lub usuń."
	/>
</svelte:head>

<section class="w-full h-full p-2 space-y-3">
	<div class="flex justify-between space-x-3 lg:space-x-0">
		<Input class="max-w-xl" type="text" placeholder="Wyszukaj..." />
		<AdminAddDialog form={data.addForm} />
	</div>
	<lr-config
		ctx-name="my-uploader"
		pubkey="demopublickey"
		multiple="true"
		multipleMax="10"
		confirmUpload="true"
		sourceList="local, url, camera, dropbox, gdrive"
	/>
	<lr-file-uploader-regular
		ctx-name="my-uploader"
		css-src="https://unpkg.com/@uploadcare/blocks@{PACKAGE_VERSION}/web/lr-file-uploader-regular.min.css"
	/>
	<lr-data-output
		ctx-name="my-uploader"
		use-event
		hidden
		class="uploader-cfg"
		on:lr-data-output={handleUploaderEvent}
	/>

	<!-- onClick={header.column.getToggleSortingHandler()} -->
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

	<Pagination2 {paginationSettings} />
	<Pagination {currentPage} {setPage} rowsPerPage={data.pageLimit} totalRows={count} />
</section>
