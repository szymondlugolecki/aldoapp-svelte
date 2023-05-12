<script lang="ts">
	import type { GridTableColumn, TableType } from '$types';
	import { onMount } from 'svelte';
	import TableCell from './TableCell.svelte';
	import { onDestroy, setContext } from 'svelte';
	import { getContext } from 'svelte';
	import { tables } from '$lib/client/stores/adminTableChanges';

	export let row: Record<string, string>;

	export let columns: GridTableColumn[];
	export let tableType: TableType;
	export let updateData: (id: string | number, changedData: Record<string, unknown>) => void;

	const hiddenColumns = columns.filter((column) => column.hidden).map((column) => column.key);
</script>

<tr class:h-28={row.id === $tables.extendedRows[tableType]}>
	{#each Object.entries(row) as [key, cellValue]}
		<!-- {console.log('cell', cell)} -->

		{#if typeof cellValue !== 'string' || !hiddenColumns.includes(key)}
			<TableCell
				rowId={typeof row.id === 'string' ? row.id : undefined}
				column={columns.find((column) => column.key === key)}
				{cellValue}
				{tableType}
				{updateData}
			/>
		{/if}
		<!-- {console.log('row', row)} -->
	{/each}
</tr>
