<script lang="ts">
	import type { BasicUser, PaginationSettings } from '$types';
	import toast from 'svelte-french-toast';
	import type { DeliveryMethod, OrderStatus, PaymentMethod } from '$lib/client/constants/dbTypes';
	import { cn, dateParser, flexRender, parseAddress, parsePLN } from '$lib/client/functions';
	import TableHyperlink from '$components/custom/table/table-hyperlink.svelte';

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

	import * as Table from '$shadcn/table';
	import { Input } from '$shadcn/input';
	import type { Address } from '$lib/server/db/schemas/orders.js';
	import { Button } from '$shadcn/button';
	import { betterZodParse } from '$lib/client/functions/betterZodParse.js';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Pagination from '$components/custom/table/pagination.svelte';
	import {
		deliveryMethodsList,
		orderStatusList,
		paymentMethodsList
	} from '$lib/client/constants/index.js';

	export let data;

	type ParsedOrder = (typeof data.orders)[number];

	const defaultColumns: ColumnDef<ParsedOrder>[] = [
		{
			header: 'Akcja',
			accessorKey: 'id',
			cell: (info) =>
				flexRender(TableHyperlink, {
					href: `/admin/zamowienia/edit/${info.getValue()}`,
					text: 'Edytuj'
				}),
			footer: (info) => info.column.id
		},
		{
			header: 'Podgląd',
			accessorKey: 'id',
			cell: (info) =>
				flexRender(TableHyperlink, {
					href: `/admin/zamowienia/edit/${info.getValue()}`,
					text: 'Szczegóły'
				})
		},
		{
			header: 'Informacje',
			accessorKey: 'status',
			accessorFn: (order) =>
				`• Status: ${orderStatusList[order.status]}\n• Kwota: ${parsePLN(order.price)}`
		},
		{
			header: 'Metody',
			accessorKey: 'deliveryMethod',
			accessorFn: (order) =>
				`• Dostawa: ${deliveryMethodsList[order.deliveryMethod]}\n• Płatność: ${
					paymentMethodsList[order.paymentMethod]
				}`
		},
		{
			header: 'Zamawiający',
			accessorKey: 'cartOwner',
			accessorFn: (order) =>
				`${order.cartOwner.fullName} ${
					order.customer.id === order.cartOwner.id ? 'dla siebie' : `dla ${order.customer.fullName}`
				}`
		},
		{
			header: 'Adres dostawy',
			accessorKey: 'address',
			accessorFn: (order) =>
				Object.values(order.address).join('').length > 1 ? parseAddress(order.address) : 'Brak'
		},
		{
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

	const setPage = (pageIndex: number) => {
		currentPage = pageIndex + 1;
		$table.setPageIndex(pageIndex);
	};

	$: options = writable<TableOptions<ParsedOrder>>({
		data: data.orders,
		columns: defaultColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		manualPagination: true
	});

	$: table = createSvelteTable(options);
	let pageParam = $page.url.searchParams.get('strona');
	let currentPage = !isNaN(Number(pageParam)) ? Math.max(Number(pageParam), 1) : 1;

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

<svelte:head>
	<title>Zamówienia • Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Lista zamówień złożonych w Twoje ALDO."
	/>
</svelte:head>
<section class="w-full h-full p-2 space-y-3">
	<!-- <div class="flex">
		<Input class="max-w-xl" type="text" placeholder="Wyszukaj..." />
	</div> -->

	<Pagination bind:paginationSettings />

	<Table.Root>
		<Table.Caption>Lista zamówień</Table.Caption>
		<Table.Header>
			{#each $table.getHeaderGroups() as headerGroup}
				<Table.Row>
					{#each headerGroup.headers as header}
						{#if !header.isPlaceholder}
							<Table.Head class={cn(`w-[100px]`)}>
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
</section>
