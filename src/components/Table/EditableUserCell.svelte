<script lang="ts">
	import { openDrawer } from '$lib/client/stores/adminDrawer';
	import type { User } from '$types';
	import type { Row } from 'gridjs';
	import type { TCell } from 'gridjs/dist/src/types';

	export let cell: TCell;
	export let row: Row;
	export let key: keyof User;

	console.log('key', key);

	$: id = row.cells[0].data?.toString();
	$: fullName = row.cells[2].data?.toString();
	$: role = row.cells[4].data?.toString();

	$: data =
		cell && typeof cell === 'object' && 'data' in cell && id && fullName && role && cell.data
			? {
					id,
					fullName,
					role,
					cellValue: cell.data
			  }
			: null;

	console.log('cell', cell);
	console.log('row', row);
</script>

{#if data}
	<button
		class="hover:text-primary duration-150"
		on:click={() =>
			openDrawer({
				type: 'user',
				action: 'edit',
				id: data ? data.id : '', // ts is too dumb for this
				key
			})}
	>
		{data.cellValue}
	</button>
{:else}
	<span>?</span>
{/if}
