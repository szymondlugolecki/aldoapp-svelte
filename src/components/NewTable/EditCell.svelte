<script lang="ts">
	import { extendRow } from '$lib/client/stores/adminTableChanges';
	import type { TableType } from '$types';
	import { ArrowDownCircle } from 'lucide-svelte';
	export let rowId: string;
	export let table: TableType;
</script>

{#if rowId && table}
	<button
		on:click={() => extendRow(table, rowId)}
		class="text-primary hover:text-primary-focus p-1.5"><ArrowDownCircle /></button
	>
{/if}
