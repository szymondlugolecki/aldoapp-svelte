<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import * as Table from '$shadcn/table';
	import type { OrderTable } from '$types';
	import { orderStatusList } from '$lib/client/constants';
	import { addPagination } from 'svelte-headless-table/plugins';
	import TableHyperlink from '$components/custom/Table/TableHyperlink.svelte';
	import DataTableActions from './data-table-actions.svelte';
	import { Button } from '$shadcn/button';

	export let data: OrderTable[] = [];
	export let count: number;
	export let pageLimit: number;

	const table = createTable(readable(data), {
		page: addPagination({
			serverSide: true,
			initialPageSize: 1
		})
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: '',
			cell: (item) => {
				return createRender(DataTableActions, { id: item.id });
			}
		}),
		// table.column({
		// 	accessor: 'id',
		// 	header: 'Szczegóły',
		// 	cell: ({ value }) => {
		// 		return createRender(TableHyperlink, { href: `/zamowienia/${value}`, text: 'Sprawdź' });
		// 	}
		// }),
		table.column({
			accessor: ({ status }) => orderStatusList[status],
			header: 'Status'
		}),
		table.column({
			accessor: ({ paid }) => (paid ? 'Tak' : 'Nie'),
			header: 'Opłacono'
		}),
		table.column({
			accessor: 'price',
			header: 'Kwota',
			cell: ({ value }) => {
				const formatted = new Intl.NumberFormat('pl-PL', {
					style: 'currency',
					currency: 'PLN'
				}).format(Number(value));
				return formatted;
			}
		}),
		table.column({
			accessor: ({ customer }) => customer.fullName,
			header: 'Klient'
		}),
		table.column({
			accessor: ({ cartOwner }) => cartOwner.fullName,
			header: 'Zleceniodawca'
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { hasNextPage, hasPreviousPage, pageIndex, serverItemCount, pageCount, pageSize } =
		pluginStates.page;

	$serverItemCount = count;
</script>

<div>
	<div class="border rounded-md">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
									<Table.Head {...attrs}>
										{#if cell.id === 'amount'}
											<div class="text-right">
												<Render of={cell.render()} />
											</div>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										{#if cell.id === 'amount'}
											<div class="font-medium text-right">
												<Render of={cell.render()} />
											</div>
										{:else if cell.id === 'status'}
											<div class="capitalize">
												<Render of={cell.render()} />
											</div>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end py-4 space-x-2">
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}>Poprzednia</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}>Następna</Button
		>
	</div>
</div>
