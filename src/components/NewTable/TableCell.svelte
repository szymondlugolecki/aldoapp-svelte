<script lang="ts">
	import { page } from '$app/stores';
	import { roleNames } from '$lib/client/constants';
	import { userRoles, type UserRole } from '$lib/client/constants/dbTypes';
	import type { GridTableColumn } from '$types';
	import { History, Save } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

	export let id: string | undefined;
	export let cell: boolean | string | Date;
	export let component: ComponentType | undefined = undefined;
	export let extendRow: (id: string) => void;
	export let isExtended = false;
	export let column: GridTableColumn | undefined;

	const editableType = column ? column['editableType'] : null;
	const formatter = column ? column['formatter'] : null;

	const props = id ? { rowId: id, extendRow } : {};
	let newValue = cell;
</script>

<td class="px-6 py-4 whitespace-nowrap text-sm-200 align-top min-w-[170px]">
	{#if component}
		{console.log('svelte:component', component)}
		<svelte:component this={component} {...props} />
	{:else}
		<div class="flex flex-col space-y-4">
			<span>{formatter ? formatter(cell) : cell}</span>
			{#if isExtended && editableType}
				{#if editableType === 'text'}
					<input bind:value={newValue} class="input input-secondary" />
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
				{:else if editableType === 'access' && typeof cell === 'boolean'}
					<input
						id="access"
						name="access"
						type="checkbox"
						checked={cell}
						class="checkbox checkbox-success"
					/>
				{/if}
				{#if cell !== newValue}
					<button
						on:click={() => {
							console.log('editing', id);
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
