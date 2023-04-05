<script lang="ts">
	import type { UserRowType, ProductWithAuthorAndImage, User } from '$types';
	import { roleNames } from '$lib/client/constants';
	import { page } from '$app/stores';
	import { CheckCircle, ExternalLink, XCircle } from 'lucide-svelte';
	import { drawer } from '$lib/client/stores/adminDrawer';
	import CellToolTip from '$components/CellToolTip.svelte';
	import { dateParser } from '$lib/client/functions';

	export let user: User;
	export let rowType: UserRowType;
</script>

{#if rowType === 'user'}
	<span class="block">{user.fullName}</span>
	<span class="block">{user.email}</span>
{:else if rowType === 'role'}
	<span
		class={`${user.role === 'admin' ? 'text-error' : ''} ${
			user.role === 'moderator' ? 'text-success' : ''
		} ${user.role === 'customer' ? 'text-info' : ''}`}>{roleNames[user.role]}</span
	>
{:else if rowType === 'action'}
	{#if user.role !== 'admin' || user.id === $page.data.user?.id}
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<label
			for="admin-drawer"
			tabindex="0"
			class="btn btn-ghost btn-sm"
			on:keypress={(e) => {
				if (e.key === 'Enter') {
					drawer.set({
						open: true,
						id: user.id,
						action: 'edit',
						type: 'user'
					});
				}
			}}
			on:click={() =>
				drawer.set({
					open: true,
					id: user.id,
					action: 'edit',
					type: 'user'
				})}
		>
			Edytuj
		</label>
	{:else}
		<span>🚫</span>
	{/if}
{:else if rowType === 'access'}
	{#if user.access}
		<CheckCircle color="green" aria-label="Brak blokady" />
	{:else}
		<XCircle color="red" aria-label="Zablokowany" />
	{/if}
{:else if rowType === 'joined'}
	<CellToolTip
		textData={dateParser(user.createdAt, 'short')}
		tooltipData={dateParser(user.createdAt, 'medium')}
	/>
{:else if rowType === 'profile'}
	<a rel="noreferrer" class="hover:text-primary" target="_blank" href={`/uzytkownik/${user.id}`}
		><ExternalLink /></a
	>
{/if}
