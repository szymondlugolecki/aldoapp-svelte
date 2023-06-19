<script lang="ts">
	import { cn, dateParser, flexRender, isJSON } from '$lib/client/functions';
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
		type SortingColumn
	} from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';
	import Pagination from '$components/Table/Pagination.svelte';
	import AdminEditDialog from '$components/AdminEditDialog.svelte';
	import AdminAddDialog from '$components/AdminAddDialog.svelte';

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
	import { goto } from '$app/navigation';
	import { ArrowUpDown } from 'lucide-svelte';
	import TableSortableHead from '$shadcn/table/TableSortableHead.svelte';
	import { page } from '$app/stores';

	export let data;

	type ParsedUser = (typeof data.users)[number];

	$: console.log('users', data.users);
	$: count = data.count[0].count;

	const createUserProps = (info: CellContext<ParsedUser, unknown>, cellTextOverride?: string) => {
		const cellValue = info.getValue();
		const keyPublicName = info.column.columnDef.header;
		const key = info.column.id;
		const elementId = info.row._getAllCellsByColumnId().id.getValue();

		return {
			cellValue,
			elementType: 'user',
			keyPublicName,
			key,
			cellTextOverride,
			elementId
		};
	};

	const addressParser = (address: Address | string | null) => {
		if (!address) return 'Brak';
		const jsonAddress = typeof address === 'string' ? isJSON<Address>(address) : address;
		const [correctAddress, addressErrors] = betterZodParse(
			userPropertySchemas.address,
			jsonAddress
		);

		if (addressErrors || !correctAddress) {
			return 'Brak';
		}

		if (Object.values(correctAddress).every((value) => !value)) return 'Brak';
		const values = Object.values(correctAddress);
		return `${values[0]} ${values[1]}, ${values[2]}`;
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
				flexRender(AdminEditDialog, createUserProps(info, roleNames[info.getValue() as Role]))
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
			cell: (info) =>
				flexRender(
					AdminEditDialog,
					createUserProps(info, addressParser(info.getValue() as Address | string | null))
				),
			enableSorting: false
		},
		{
			id: 'access',
			header: 'Dostęp',
			accessorKey: 'access',
			cell: (info) =>
				flexRender(AdminEditDialog, createUserProps(info, info.getValue() ? 'Tak 🟢' : 'Nie 🔴'))
		},
		{
			id: 'createdAt',
			header: 'Dołączył',
			accessorKey: 'createdAt',
			cell: (info) => dateParser(info.getValue() as Date, 'short')
		}
	];

	let sorting: SortingState = [];

	const setSorting = (updater: any) => {
		console.log('sorting');
		if (updater instanceof Function) {
			sorting = updater(sorting);
		} else {
			sorting = updater;
		}

		options.update((options) => ({
			...options,
			state: {
				...options.state,
				sorting
			}
		}));
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
		manualSorting: true
	});

	$: table = createSvelteTable(options);

	// const rerender = () => {
	// 	options.update((options) => ({
	// 		...options,
	// 		data: parsedUsers
	// 	}));
	// };

	// $: {
	// 	const sortOptions = $options?.state?.sorting;
	// 	if (sortOptions && sortOptions[0] && sortOptions[0].id) {
	// 		const { desc } = sortOptions[0];
	// 		goto(`?strona=${currentPage}&sort=${sortOptions[0].id}&desc=${desc.toString()}`);
	// 	}
	// }

	$: pageParam = $page.url.searchParams.get('strona');
	$: currentPage = !isNaN(Number(pageParam)) ? Math.max(Number(pageParam), 1) : 1;

	$: linkToPage = () => {
		const url = $page.url.searchParams;
		const sortingOpts = $options.state?.sorting;
		if (sortingOpts && sortingOpts[0]) {
			url.set('sort', sorting[0].id);
			url.set('desc', sorting[0].desc.toString());
		}
		url.set('strona', currentPage.toString());
		console.log('link to page =>', `?${url.toString()}`);
		return `?${url.toString()}`;
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
	<!-- <div class="collapse border border-base-300 rounded-box">
		<input type="checkbox" />
		<div class="collapse-title text-xl font-medium">Filtrowanie</div>
		<div class="collapse-content">
			<div class="space-y-0.5">
				<span class="block label">Rola</span>

				<div class="grid grid-cols-2 sm:grid-cols-4">
					<label class="cursor-pointer label justify-start space-x-2">
						<input
							type="checkbox"
							bind:checked={filter.roles.customer}
							class="checkbox checkbox-info"
						/>
						<span class="label-text">Klient</span>
					</label>
					<label class="cursor-pointer label justify-start space-x-2">
						<input
							type="checkbox"
							bind:checked={filter.roles.driver}
							class="checkbox checkbox-success"
						/>
						<span class="label-text">Kierowca</span>
					</label>
					<label class="cursor-pointer label justify-start space-x-2">
						<input
							type="checkbox"
							bind:checked={filter.roles.adviser}
							class="checkbox checkbox-success"
						/>
						<span class="label-text">Doradca</span>
					</label>
					<label class="cursor-pointer label justify-start space-x-2">
						<input
							type="checkbox"
							bind:checked={filter.roles.admin}
							class="checkbox checkbox-error"
						/>
						<span class="label-text">Admin</span>
					</label>
				</div>

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
		<Button variant="secondary"><AdminAddDialog elementType="user" /></Button>
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
								<TableSortableHead href={linkToPage()} sortable={header.column.getCanSort()}>
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

	<!-- <Grid
		{columns}
		language={plPL}
		search
		fixedHeader
		className={{
			td: 'text-base-content',
			sort: 'text-base-content bg-base-content'
		}}
		data={parsedUsers.map((user) => {
			const { id, createdAt, email, fullName, role, access, phone, adviser } = user;
			const parsedUser = {
				id,
				profile: null,
				fullName,
				email,
				role,
				phone,
				adviser,
				access,
				createdAt
			};
			return Object.values(parsedUser);
		})}
	/> -->

	<Pagination {currentPage} rowsPerPage={data.pageLimit} totalRows={count} />
</section>
