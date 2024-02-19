<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import * as Table from '$shadcn/table';
	import type { OrderTable } from '$types';
	import { orderStatusList } from '$lib/client/constants';
	import { addPagination, addResizedColumns } from 'svelte-headless-table/plugins';
	import TableHyperlink from '$components/custom/Table/TableHyperlink.svelte';
	import { Button } from '$shadcn/button';
	import type { PageServerData } from '../$types';
	import TableImage from './table-image.svelte';
	import { cn, parsePLN } from '$lib/client/functions';

	export let products: PageServerData['order']['products'];

	const table = createTable(readable(products), {
		resize: addResizedColumns({})
	});

	const getProductImage = (encodedURL: string) => {
		const product = products.find(({ encodedURL: url }) => url === encodedURL);
		return product && product.image ? product.image : '';
	};

	const columns = table.createColumns([
		table.column({
			accessor: 'encodedURL',
			header: '',
			cell: ({ value, state }) => {
				return createRender(TableImage, {
					href: `/sklep/${value}`,
					alt: 'produkt',
					image: getProductImage(value)
				});
			},
			plugins: {
				resize: {
					maxWidth: 150
				}
			}
		}),
		table.column({
			accessor: ({ name }) => name,
			header: 'Produkt'
		}),
		table.column({
			accessor: 'price',
			header: 'Kwota',
			cell: ({ value }) => parsePLN(value)
		}),
		table.column({
			accessor: ({ quantity }) => quantity,
			header: 'Ilość'
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
</script>

<div>
	<div class="border rounded-md">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow (headerRow.id)}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Head {...attrs}>
										<Render of={cell.render()} />
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
</div>
