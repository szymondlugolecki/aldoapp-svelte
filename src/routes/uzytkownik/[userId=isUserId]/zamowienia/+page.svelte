<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { orderStatusList } from '$lib/client/constants/index.js';
	import {
		parseAddress,
		cn,
		dateParser,
		isAtLeastModerator,
		parsePLN
	} from '$lib/client/functions/index.js';
	import * as Table from '$shadcn/table';

	import type { ExtendedCategory, PaginationSettings, User } from '$types';
	import { flexRender } from '$lib/client/functions';
	import {
		type ColumnDef,
		type SortingState,
		type TableOptions,
		getCoreRowModel,
		getPaginationRowModel,
		createSvelteTable,
		type PaginationState,
		type Updater
	} from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';
	import TableHyperlink from '$components/custom/table/table-hyperlink.svelte';
	import type { Address } from '$lib/server/db/schemas/orders.js';
	import * as Sheet from '$shadcn/sheet/index.js';

	import { Filter } from 'lucide-svelte';
	import { Button, buttonVariants } from '$shadcn/button';
	import Filters from './(components)/filters.svelte';
	import { builderActions } from 'bits-ui';
	import { onMount } from 'svelte';
	import type { mainCategories } from '$lib/client/constants/dbTypes';
	import Pagination from '$components/custom/table/pagination.svelte';

	export let data;

	type ParsedOrder = (typeof data.orders)[number];

	onMount(() => {
		console.log(data.orders);
	});

	const defaultColumns: ColumnDef<ParsedOrder>[] = [
		{
			id: 'id',
			header: 'Szczegóły',
			accessorKey: 'id',
			cell: (info) =>
				flexRender(TableHyperlink, {
					href: `/zamowienia/${info.getValue() as string}`,
					text: 'Sprawdź'
				})
		},
		{
			id: 'status',
			header: 'Status',
			accessorKey: 'status',
			cell: (info) => orderStatusList[info.getValue() as keyof typeof orderStatusList]
		},
		{
			id: 'price',
			header: 'Suma',
			accessorKey: 'price',
			cell: (info) => parsePLN(info.getValue() as number)
		},
		{
			id: 'products',
			header: 'Produkty',
			accessorKey: 'products',
			cell: (info) => {
				const products = info.getValue() as (typeof data.orders)[number]['products'];
				if (!Array.isArray(products)) return '?';

				// console.log('products', products);

				return products.map((product) => product.name).join('\n');
			}
		},
		{
			id: 'cartOwner',
			header: 'Zleceniodawca',
			accessorKey: 'cartOwner',
			cell: (info) => (info.getValue() as User)['fullName']
		},
		{
			id: 'customer',
			header: 'Klient',
			accessorKey: 'customer',
			cell: (info) => (info.getValue() as User)['fullName']
		},
		{
			id: 'address',
			header: 'Adres dostawy',
			accessorKey: 'address',
			cell: (info) => parseAddress(info.getValue() as Address) || 'Brak'
		},
		{
			id: 'createdAt',
			header: 'Złożono',
			accessorKey: 'createdAt',
			cell: (info) => dateParser(info.getValue() as Date, 'medium')
		}
	];

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

	// $: options = writable<TableOptions<ParsedOrder>>({
	// 	data: data.orders,
	// 	columns: defaultColumns,
	// 	getCoreRowModel: getCoreRowModel(),
	// 	getPaginationRowModel: getPaginationRowModel(),
	// 	state: {
	// 		sorting,
	// 		columnVisibility: {
	// 			customer: !!$page.data.me && isAtLeastModerator($page.data.me.role)
	// 		}
	// 	},
	// 	enableSorting: true,
	// 	onSortingChange: setSorting,
	// 	manualSorting: true,
	// 	manualPagination: true
	// });

	$: options = writable<TableOptions<ParsedOrder>>({
		data: data.orders,
		columns: defaultColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			columnVisibility: {
				customer: !!$page.data.me && isAtLeastModerator($page.data.me.role)
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
</script>

<div class="flex flex-col w-full h-full gap-3">
	<div class="flex flex-col p-4 border rounded-lg border-border gap-y-3">
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<div>
					<Button builders={[builder]} variant="outline"
						><Filter class="square-4 mr-1.5" /> Filtrowanie</Button
					>
				</div>
			</Sheet.Trigger>
			<Sheet.Content side="left" class="w-[320px]">
				<Sheet.Header>
					<Sheet.Title>Filtrowanie</Sheet.Title>
					<Sheet.Description>Wybierz interesujące Cię zamówienia.</Sheet.Description>
				</Sheet.Header>
				<Filters orderDetails={data.orderDetails} />
				<Sheet.Footer>
					<Sheet.Close asChild let:builder>
						<Button builders={[builder]} href={$page.url.pathname} variant="link">Reset</Button>

						<button
							type="submit"
							form="order-filter-form"
							use:builderActions={{ builders: [builder] }}
							class={buttonVariants({ variant: 'default' })}
						>
							Zastosuj
						</button>
					</Sheet.Close>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>

		<Table.Root>
			<Table.Caption>{data.profile.fullName} - Historia zamówień</Table.Caption>
			<Table.Header>
				{#each $table.getHeaderGroups() as headerGroup}
					<Table.Row>
						{#each headerGroup.headers as header}
							{#if !header.isPlaceholder}
								<Table.Head class="w-[100px]">
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

		<Pagination bind:paginationSettings />
	</div>
</div>
