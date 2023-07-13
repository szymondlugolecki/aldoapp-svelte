<script lang="ts">
	import { addressParser, cn, dateParser, flexRender, isJSON } from '$lib/client/functions';
	import { roleNames } from '$lib/client/constants';
	import type { Role, UserSortableColumn } from '$types';
	import type { UserRole } from '$lib/client/constants/dbTypes.js';

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
	import AdminEditDialog from '$components/Dialogs/Admin/Edit/User.svelte';
	import AdminAddDialog from '$components/Dialogs/Admin/Add/User.svelte';

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
	import { userPropertySchemas } from '$lib/client/schemas/users.js';
	import { betterZodParse } from '$lib/client/functions/betterZodParse.js';
	import TableSortableHead from '$shadcn/table/TableSortableHead.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let data;

	type ParsedUser = (typeof data.users)[number];

	$: console.log('users', data.users);
	$: count = data.count[0].count;

	const createUserProps = (info: CellContext<ParsedUser, unknown>) => {
		const value = info.getValue();
		const keyPublicName = info.column.columnDef.header;
		const key = info.column.id;

		const user = info.table.options.data.find(
			(user) => user.id === info.row._getAllCellsByColumnId().id.getValue()
		);

		return {
			value,
			keyPublicName,
			key,
			user
		};
	};

	const defaultColumns: ColumnDef<ParsedUser>[] = [
		{
			id: 'id',
			accessorKey: 'id',
			enableSorting: false
		},
		{
			id: 'fullName',
			header: 'Imię i nazwisko',
			accessorKey: 'fullName',
			cell: (info) => flexRender(AdminEditDialog, createUserProps(info)),
			enableSorting: true
		},
		{
			id: 'email',
			header: 'Email',
			accessorKey: 'email',
			cell: (info) => flexRender(AdminEditDialog, createUserProps(info)),
			enableSorting: true
		},
		{
			id: 'role',
			header: 'Rola',
			accessorKey: 'role',
			cell: (info) =>
				flexRender(AdminEditDialog, createUserProps(info))
		},
		{
			id: 'phone',
			header: 'Telefon',
			accessorKey: 'phone',
			cell: (info) => flexRender(AdminEditDialog, createUserProps(info)),
			enableSorting: false
		},
		{
			id: 'address',
			header: 'Adres',
			accessorKey: 'address',
			cell: (info) => flexRender(AdminEditDialog, createUserProps(info)),
			enableSorting: false
		},
		{
			id: 'adviser',
			header: 'Doradca',
			accessorKey: 'adviser',
			cell: (info) => flexRender(AdminEditDialog, createUserProps(info))
		},
		{
			id: 'access',
			header: 'Dostęp',
			accessorKey: 'access',
			cell: (info) => flexRender(AdminEditDialog, createUserProps(info))
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
			goto(`?${url.toString()}`).then(() => rerender());
		}
	};

	let currentPage = 1;

	const setPage = (pageIndex: number) => {
		currentPage = pageIndex + 1;
		console.log('setting page index to', pageIndex);
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

	$: pageParam = $page.url.searchParams.get('strona');
	$: currentPage = !isNaN(Number(pageParam)) ? Math.max(Number(pageParam), 1) : 1;
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
		<Input class="max-w-xl" type="text" placeholder="Wyszukaj..." />
		<Button variant="secondary"><AdminAddDialog /></Button>
	</div>

	<Table>
		<TableCaption>Lista użytkowników</TableCaption>
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
