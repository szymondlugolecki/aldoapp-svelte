<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import type { User } from '@prisma/client';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { X } from 'lucide-svelte';
	import { drawer } from '$lib/client/stores/adminDrawer';
	import ModalHeader from '../ModalHeader.svelte';

	export let user: User | undefined;
</script>

{#if user}
	<form
		class="flex flex-col space-y-4"
		method="post"
		action="?/edit"
		on:submit={() => {
			drawer.update((value) => {
				if (!value) return undefined;
				return {
					...value,
					open: false
				};
			});
		}}
		use:enhance={() => {
			const toastId = createLoadingToast('please-wait');
			return async ({ result, update }) => {
				handleFormResponse(result, toastId);
				drawer.set(undefined);
				update();
			};
		}}
	>
		<ModalHeader title="Edytuj użytkownika" />

		<div>
			<label for="name" class="label label-text"> Imię i nazwisko </label>
			<input
				type="text"
				name="name"
				class="input input-bordered w-full text-base-content"
				required
				value={user.fullName}
			/>
		</div>

		<div>
			<label for="name" class="label label-text"> Email </label>
			<input
				type="email"
				name="email"
				class="input input-bordered w-full text-base-content"
				value={user.email}
				required
			/>
		</div>

		<div>
			<label for="name" class="label label-text"> Rola </label>
			<select id="role-selection" name="role" class="select select-bordered w-full">
				<option selected={user.role === 'customer'} value="customer">Klient</option>
				<option selected={user.role === 'moderator'} value="moderator">Moderator</option>
				{#if $page.data.user?.role === 'admin'}
					<option selected={user.role === 'admin'} value="admin">Admin</option>
				{/if}
			</select>
		</div>

		{#if user.role !== 'admin' && (user.role !== 'moderator' || $page.data.user?.role === 'admin')}
			<div class="flex items-center mb-4">
				<input
					id="banned"
					name="banned"
					type="checkbox"
					value="true"
					checked={user.banned}
					class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
				/>
				<label for="banned" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
					>Zablokuj</label
				>
			</div>
		{/if}

		<button type="submit" class="btn btn-primary w-full">Edytuj</button>
		<input type="hidden" hidden value={user.id} name="id" />
	</form>
{:else}
	<p>Nie znaleziono użytkownika 😥</p>
{/if}
