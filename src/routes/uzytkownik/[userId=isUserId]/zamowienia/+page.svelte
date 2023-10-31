<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Pagination2 from '$components/custom/Table/Pagination2.svelte';
	import { orderStatusList } from '$lib/client/constants/index.js';
	import { parseAddress, cn, dateParser, isAtLeastModerator } from '$lib/client/functions/index.js';
	import {
		Table,
		TableBody,
		TableCaption,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$shadcn/table';
	import type { ExtendedCategory, PaginationSettings, User } from '$types';
	import { flexRender } from '$lib/client/functions';
	import {
		type ColumnDef,
		type SortingState,
		type TableOptions,
		getCoreRowModel,
		getPaginationRowModel,
		createSvelteTable
	} from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';
	import TableHyperlink from '$components/custom/Table/TableHyperlink.svelte';
	import type { Address } from '$lib/server/db/schemas/orders.js';
	import * as Sheet from '$shadcn/sheet/index.js';

	import { Filter } from 'lucide-svelte';
	import { Button, buttonVariants } from '$shadcn/button';
	import Filters from './(components)/Filters.svelte';
	import { builderActions } from 'bits-ui';
	import { onMount } from 'svelte';
	import type { mainCategories } from '$lib/client/constants/dbTypes';

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
				}),
			enableSorting: false
		},
		{
			id: 'status',
			header: 'Status',
			accessorKey: 'status',
			cell: (info) => orderStatusList[info.getValue() as keyof typeof orderStatusList],
			enableSorting: true
		},
		{
			id: 'price',
			header: 'Kwota (z rabatem)',
			accessorKey: 'price',
			cell: (info) => info.getValue(),
			enableSorting: true
		},
		{
			id: 'products',
			header: 'Produkty',
			accessorKey: 'products',
			cell: (info) => {
				const products = info.getValue() as (typeof data.orders)[number]['products'];
				if (!Array.isArray(products)) return '?';

				console.log('products', products);

				return products.map((product) => `${product.name} (x${product.quantity})`).join('\n');
			},
			enableSorting: false
		},
		{
			id: 'cartOwner',
			header: 'Zleceniodawca',
			accessorKey: 'cartOwner',
			cell: (info) => (info.getValue() as User)['fullName'],
			enableSorting: true
		},
		{
			id: 'customer',
			header: 'Klient',
			accessorKey: 'customer',
			cell: (info) => (info.getValue() as User)['fullName'],
			enableSorting: true
		},
		{
			id: 'address',
			header: 'Adres dostawy',
			accessorKey: 'address',
			cell: (info) => parseAddress(info.getValue() as Address),
			enableSorting: false
		},
		{
			id: 'createdAt',
			header: 'Złożono',
			accessorKey: 'createdAt',
			cell: (info) => dateParser(info.getValue() as Date, 'short')
		}
	];

	let sorting: SortingState = [];

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

	$: options = writable<TableOptions<ParsedOrder>>({
		data: data.orders,
		columns: defaultColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			sorting,
			columnVisibility: {
				customer: !!$page.data.user && isAtLeastModerator($page.data.user.role)
			}
		},
		enableSorting: true,
		onSortingChange: setSorting,
		manualSorting: true,
		manualPagination: true
	});

	$: table = createSvelteTable(options);

	$: pageParam = Number($page.url.searchParams.get('strona')) || 1;
	const currentPage = writable(pageParam);

	$: {
		currentPage.set(pageParam);
	}

	const paginationSettings: PaginationSettings = {
		count: data.orders.length || data.count[0].count,
		perPage: data.pageLimit,
		onPageChange: ({ curr, next }) => {
			if (next !== curr) {
				const url = new URLSearchParams($page.url.searchParams);
				url.set('strona', next.toString());
				goto(`?${url.toString()}`).then(() => rerender());
			}
			return next;
		},
		page: currentPage
	};
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

		<Table>
			<TableCaption>{data.profile.fullName} - Historia zamówień</TableCaption>
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

		<Pagination2 {paginationSettings} />
	</div>
</div>
