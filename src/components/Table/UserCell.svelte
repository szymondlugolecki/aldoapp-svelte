<script lang="ts">
	import type { UserRowType, ProductWithAuthorAndImage, User } from '$types';
	import { roleNames } from '$lib/client/constants';
	import { page } from '$app/stores';
	import { CheckCircle, ExternalLink, XCircle } from 'lucide-svelte';
	import { drawer } from '$lib/client/stores/adminDrawer';

	export let user: User;
	export let rowType: UserRowType;

	// userTable
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
	<div
		class="tooltip"
		data-tip={user.createdAt.toLocaleDateString('pl-PL', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		})}
	>
		<span
			>{user.createdAt.toLocaleDateString('pl-PL', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			})}</span
		>
	</div>
{:else if rowType === 'profile'}
	<a rel="noreferrer" class="hover:text-primary" target="_blank" href={`/uzytkownik/${user.id}`}
		><ExternalLink /></a
	>
{/if}
