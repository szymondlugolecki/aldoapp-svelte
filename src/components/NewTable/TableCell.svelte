<script lang="ts">
	import { page } from '$app/stores';
	import { wretchClient } from '$lib/client/constants';
	import type { GridTableColumn } from '$types';
	import { History, Save } from 'lucide-svelte';
	import toast from 'svelte-french-toast';

	export let id: string | undefined;
	export let cell: boolean | string | Date;
	export let extendRow: (id: string) => void;
	export let isExtended = false;
	export let column: GridTableColumn | undefined;
	export let tableName: 'users' | 'orders' | 'promocodes' | 'products' | 'categories';

	const editableType = column ? column['editableType'] : null;
	const formatter = column ? column['formatter'] : null;

	const props = id ? { rowId: id, extendRow } : {};
	let newValue = cell;

	$: console.log('newValue', newValue, 'cell', cell);

	const editRequest = (payload: Record<string, unknown>) => {
		wretchClient
			.url(`/update/${tableName}`)
			.post({ id, ...payload })
			.json((data) => {
				console.log('data', data);
				import('svelte-french-toast').then((module) => {
					module.toast.success('Zapisano zmiany');
				});
			});
	};
</script>

{#if column}
	<td class="px-6 py-4 whitespace-nowrap text-sm-200 align-top min-w-[170px]">
		{#if column.component}
			<svelte:component this={column.component} {...props} />
		{:else}
			<div class="flex flex-col space-y-4">
				<span>{formatter ? formatter(cell) : cell}</span>
				{#if isExtended && editableType}
					{#if editableType === 'text'}
						<input bind:value={newValue} class="input input-secondary w-fit" />
					{:else if editableType === 'role'}
						<select
							bind:value={newValue}
							id="role-selection"
							name="role"
							class="select select-bordered w-full"
						>
							<option value="customer">Klient</option>
							<option value="driver">Kierowca</option>
							<option value="adviser">Doradca</option>
							{#if $page.data.user?.role === 'admin'}
								<option value="admin">Admin</option>
							{/if}
						</select>
					{:else if editableType === 'access' && typeof cell === 'boolean' && typeof newValue === 'boolean'}
						<input
							id="access"
							name="access"
							type="checkbox"
							class="checkbox checkbox-success"
							bind:checked={newValue}
						/>
					{/if}
					{#if cell !== newValue}
						<button
							on:click={() => {
								console.log('editing', id);
								if (column) {
									editRequest({ [column.key]: newValue });
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
					{/if}
				{/if}
			</div>
		{/if}
	</td>
{/if}
