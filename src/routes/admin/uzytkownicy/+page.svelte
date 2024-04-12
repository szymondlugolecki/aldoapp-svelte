<script lang="ts">
	import { cn, dateParser, debounce, flexRender } from '$lib/client/functions';
	import type { PaginationSettings } from '$types';

	import {
		createSvelteTable,
		getCoreRowModel,
		getPaginationRowModel,
		type ColumnDef,
		type TableOptions,
		type SortingState,
		type Updater,
		type PaginationState
	} from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';
	import AdminEditDialog from './(components)/edit-user.svelte';
	import AdminAddDialog from './(components)/add-user.svelte';
	import TableHyperlink from '$components/custom/Table/TableHyperlink.svelte';

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
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Pagination3 from '$components/custom/Pagination3.svelte';
	import { createProps } from '$lib/client/functions/table';
	// import { superForm } from 'sveltekit-superforms/client';

	import type { EditUserForm } from '$lib/client/schemas/user.js';

	export let data;

	type ParsedUser = (typeof data.users)[number];

	const { count } = data;

	const defaultColumns: ColumnDef<ParsedUser>[] = [
		{
			id: 'id',
			accessorKey: 'id',
			enableSorting: false
		},
		{
			id: 'profileUrl',
			header: 'Profil użytkownika',
			accessorKey: 'id',
			cell: (info) =>
				flexRender(TableHyperlink, { href: `/uzytkownik/${info.getValue()}`, text: 'Sprawdź' }),
			enableSorting: false
		},
		{
			id: 'fullName',
			header: 'Imię i nazwisko',
			accessorKey: 'fullName',
			cell: (info) =>
				flexRender(AdminEditDialog, createProps<ParsedUser, EditUserForm>(info, data.editForm)),
			enableSorting: true
		},
		{
			id: 'email',
			header: 'Email',
			accessorKey: 'email',
			cell: (info) =>
				flexRender(AdminEditDialog, createProps<ParsedUser, EditUserForm>(info, data.editForm)),
			enableSorting: true
		},
		{
			id: 'role',
			header: 'Rola',
			accessorKey: 'role',
			cell: (info) =>
				flexRender(AdminEditDialog, createProps<ParsedUser, EditUserForm>(info, data.editForm))
		},
		{
			id: 'phone',
			header: 'Telefon',
			accessorKey: 'phone',
			cell: (info) =>
				flexRender(AdminEditDialog, createProps<ParsedUser, EditUserForm>(info, data.editForm)),
			enableSorting: false
		},
		{
			id: 'address',
			header: 'Adres',
			accessorKey: 'address',
			cell: (info) =>
				flexRender(AdminEditDialog, createProps<ParsedUser, EditUserForm>(info, data.editForm)),
			enableSorting: false
		},
		{
			id: 'adviser',
			header: 'Doradca',
			accessorKey: 'adviser',
			cell: (info) =>
				flexRender(
					AdminEditDialog,
					createProps<ParsedUser, EditUserForm>(info, data.editForm, {
						advisers: data.advisers
					})
				)
		},
		{
			id: 'createdAt',
			header: 'Dołączył',
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
			data: data.users
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
					data: data.users,
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
			goto(`?${url.toString()}`, { noScroll: true }).then(() => rerender());
		}
	};

	const setPage = (pageIndex: number) => {
		currentPage = pageIndex + 1;
		$table.setPageIndex(pageIndex);
	};

	$: options = writable<TableOptions<ParsedUser>>({
		data: data.users,
		columns: defaultColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			columnVisibility: {
				id: false
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
	let searchParam = $page.url.searchParams.get('szukaj');
	let pageParam = $page.url.searchParams.get('strona');
	let currentPage = !isNaN(Number(pageParam)) ? Math.max(Number(pageParam), 1) : 1;

	let paginationSettings = {
		page: currentPage,
		count,
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
		goto(`?${params.toString()}`, { keepFocus: true });
	};
</script>

<svelte:head>
	<title>Użytkownicy • Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Lista użytkowników zarejestrowanych w Twoje ALDO. Dodaj, edytuj lub zablokuj."
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

	<Pagination3 {paginationSettings} />

	<Table>
		<TableCaption>Lista użytkowników</TableCaption>
		<TableHeader>
			{#each $table.getHeaderGroups() as headerGroup}
				<TableRow>
					{#each headerGroup.headers as header}
						{#if !header.isPlaceholder}
							<TableHead
								class={cn(
									`w-[100px]`,
									header.column.getCanSort() &&
										'cursor-pointer transition-colors hover:bg-muted/10 hover:rounded-md'
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
			{#each $table.getRowModel().rows as row, bodyRowIndex}
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

	<Pagination3 {paginationSettings} />
</section>
