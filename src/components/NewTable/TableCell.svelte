<script lang="ts">
	import { page } from '$app/stores';
	import { wretchClient } from '$lib/client/constants';
	import {
		changeTableRow,
		clearRowChanges,
		getRowChanges,
		tables
	} from '$lib/client/stores/adminTableChanges';
	import type { GridTableColumn, TableType } from '$types';
	import { History, Save } from 'lucide-svelte';
	import { getContext, onMount, setContext } from 'svelte';
	import toast from 'svelte-french-toast';
	import EditCell from './EditCell.svelte';

	export let rowId: string | undefined;
	export let cellValue: boolean | string | Date;
	export let column: GridTableColumn | undefined;
	export let tableType: TableType;
	export let updateData: (id: string | number, changedData: Record<string, unknown>) => void;

	$: isExtended = $tables.extendedRows[tableType] === rowId;

	const editableType = column ? column['editableType'] : null;
	const formatter = column ? column['formatter'] : null;

	const props = rowId ? { rowId, table: tableType } : {};
	let newValue = cellValue;

	tables.subscribe((t) => {
		// value changed previously but changes were cleared
		if (
			newValue !== cellValue &&
			rowId &&
			Object.keys(t.changes[tableType]?.[rowId]).length === 0
		) {
			newValue = cellValue;
		}
	});

	const updateContext = () => {
		// console.log(0, 'updateContext');
		// if (!column) return;
		// console.log(1, 'updateContext');
		// const context = getContext<Record<string, unknown>>('changes');
		// setContext('changes', {
		// 	...context,
		// 	...(Object.keys(context)?.includes('id') ? {} : { rowId }),
		// 	[column.key]: newValue
		// });
		console.log('updating context');
		if (rowId && column) {
			changeTableRow(tableType, rowId, column.key, newValue);
		}
		console.log('changed', $tables);
	};

	const updateRequest = () => {
		if (!rowId) {
			return toast.error('Nie można zapisać zmian w wierszu bez id elementu');
		}
		const payload = getRowChanges(tableType, rowId);
		if (!payload || Object.keys(payload).length === 0) {
			return toast.error('Nie ma zmian do zapisania');
		}
		wretchClient
			.url(`/update/${tableType}`)
			.post({ id: rowId, ...payload })
			.json((data) => {
				console.log('data', data);
				import('svelte-french-toast').then((module) => {
					module.toast.success('Zapisano zmiany');
					if (rowId) {
						updateData(rowId, payload);
						clearRowChanges(tableType, rowId);
					}
				});
			});
	};

	console.log('tables', $tables);
</script>

{#if column && !column.hidden}
	<td class="px-6 py-4 whitespace-nowrap text-sm-200 align-top w-[180px]">
		{#if column.isExpandComponent && rowId && tableType}
			<div class="flex flex-col space-y-4">
				<EditCell {rowId} table={tableType} />
				{#if isExtended && $tables.changes[tableType] && $tables.changes[tableType][rowId] && Object.keys($tables.changes[tableType][rowId]).length > 0}
					<button
						on:click={() => {
							if (column) {
								updateRequest();
								console.log('sending this =>', { [column.key]: newValue });
							}
						}}
						class="btn btn-ghost text-primary hover:text-primary-focus disabled:text-zinc-500"
						aria-label="Zapisz"><Save /></button
					>
					<button
						on:click={() => {
							if (rowId) {
								clearRowChanges(tableType, rowId);
							}
						}}
						class="btn btn-ghost text-accent hover:text-accent-focus disabled:text-zinc-500"
						aria-label="Cofnij"><History /></button
					>
				{/if}
			</div>
		{:else if column.component}
			{#if props}
				<svelte:component this={column.component} {...props} />
			{/if}
		{:else}
			<div class="flex flex-col space-y-4">
				<span>{formatter ? formatter(cellValue) : cellValue}</span>
				{#if isExtended && editableType}
					{#if editableType === 'text'}
						<input
							bind:value={newValue}
							on:change={updateContext}
							class="input input-secondary max-w-[175px]"
						/>
					{:else if editableType === 'role'}
						<select
							bind:value={newValue}
							on:change={updateContext}
							id="role-selection"
							name="role"
							class="select select-bordered w-full min-w-[130px]"
						>
							<option value="customer">Klient</option>
							<option value="driver">Kierowca</option>
							<option value="adviser">Doradca</option>
							{#if $page.data.user?.role === 'admin'}
								<option value="admin">Admin</option>
							{/if}
						</select>
					{:else if editableType === 'access' && typeof cellValue === 'boolean' && typeof newValue === 'boolean'}
						<input
							id="access"
							name="access"
							type="checkbox"
							class="checkbox checkbox-success"
							bind:checked={newValue}
							on:change={updateContext}
						/>
					{/if}
					<!-- {#if cell !== newValue}
						<button
							on:click={() => {
								console.log('editing', id);
								if (column) {
									updateRequest();
									console.log('sending this =>', { [column.key]: newValue });
								}
							}}
							disabled={cell === newValue}
							class="btn btn-ghost text-primary hover:text-primary-focus disabled:text-zinc-500"
							aria-label="Zapisz">Zapisz <Save class="ml-1.5" /></button
						>
						<button
							on:click={() => {
								newValue = cell;
							}}
							disabled={cell === newValue}
							class="btn btn-ghost text-accent hover:text-accent-focus disabled:text-zinc-500"
							aria-label="Cofnij">Cofnij <History class="ml-1.5" /></button
						>
					{/if} -->
				{/if}
			</div>
		{/if}
	</td>
{/if}
