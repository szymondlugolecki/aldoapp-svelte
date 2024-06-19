<script lang="ts">
	import {
		cn,
		dateParser,
		debounce,
		flexRender,
		parseAddress,
		phoneParser
	} from '$lib/client/functions';
	import type { PaginationSettings, User } from '$types';

	import {
		createSvelteTable,
		getCoreRowModel,
		getPaginationRowModel,
		type ColumnDef,
		type TableOptions,
		type Updater,
		type PaginationState
	} from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';
	import AdminEditDialog from './(components)/edit-user.svelte';
	import AdminAddDialog from './(components)/add-user.svelte';
	import TableHyperlink from '$components/custom/table/table-hyperlink.svelte';

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
	import Pagination from '$components/custom/table/pagination.svelte';
	import { createProps } from '$lib/client/functions/table';
	// import { superForm } from 'sveltekit-superforms/client';

	import type { EditUserForm } from '$lib/client/schemas/user.js';
	import { roleNames } from '$lib/client/constants';
	import type { UserRole } from '$lib/client/constants/dbTypes';
	import type { Address } from '$lib/server/db/schemas/orders';
	import UserMiniProfile from './(components)/user-mini-profile.svelte';

	export let data;

	type ParsedUser = (typeof data.users)[number];

	const defaultColumns: ColumnDef<ParsedUser>[] = [
		{
			header: 'Akcja',
			accessorKey: 'id',
			cell: (info) =>
				flexRender(TableHyperlink, {
					href: `/admin/uzytkownicy/edit/${info.getValue()}`,
					text: 'Edytuj'
				}),
			footer: (info) => info.column.id
		},
		{
			header: 'Profil użytkownika',
			accessorKey: 'fullName',
			cell: (info) => flexRender(UserMiniProfile, { info }),
			footer: (info) => info.column.id
		},
		{
			header: 'Rola',
			accessorKey: 'role',
			cell: (info) => roleNames[info.getValue() as UserRole],
			footer: (info) => info.column.id
		},
		{
			header: 'Adres',
			accessorKey: 'address',
			accessorFn: (user) =>
				Object.values(user.address).join('').length > 3 ? parseAddress(user.address) : 'Brak',
			footer: (info) => info.column.id
		},
		{
			header: 'Doradca',
			accessorKey: 'adviser',
			cell: (info) =>
				(info.getValue() as Pick<User, 'id' | 'fullName' | 'email'> | undefined)?.fullName ||
				'Brak',
			footer: (info) => info.column.id
		},
		{
			header: 'Dołączył(a)',
			accessorKey: 'createdAt',
			cell: (info) => dateParser(info.getValue() as Date, 'short')
		}
	];

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
				id: true
			}
		},
		enableSorting: false,
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
		{#if data.me?.role === 'admin'}
			<AdminAddDialog superform={data.addForm} />
		{/if}
	</div>

	<Pagination bind:paginationSettings />

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

	<Pagination bind:paginationSettings />
</section>
