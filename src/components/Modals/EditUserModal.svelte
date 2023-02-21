<script lang="ts">
	import { enhance } from '$app/forms';
	import { isValidObject } from '$lib/client/functions';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import { errorToast, successToast } from '$lib/client/functions/toasts';
	import type { User } from '@prisma/client';
	import { Button, Modal, Label, Input } from 'flowbite-svelte';

	export let editUserModalOpen: boolean;
	export let editUserModal: User | undefined;
</script>

<Modal bind:open={editUserModalOpen} size="xs" autoclose={false} class="w-full">
	{#if editUserModal}
		<form
			class="flex flex-col space-y-6"
			method="post"
			action="?/edit"
			use:enhance={({ form, data, action, cancel }) => {
				return async ({ result, update }) => {
					handleFormResponse(result, 'Pomyślnie edytowano użytkownika');
					update();
					editUserModalOpen = false;
				};
			}}
		>
			<h3 class="text-xl font-medium 1text-gray-900 dark:text-white p-0">Edytuj użytkownika</h3>
			<Label class="space-y-2">
				<span>Imię i nazwisko</span>
				<Input type="text" name="name" required value={editUserModal.fullName} />
			</Label>
			<Label class="space-y-2">
				<span>Email</span>
				<Input
					type="email"
					name="email"
					placeholder="jan.kowalski@gmail.com"
					required
					value={editUserModal.email}
				/>
			</Label>

			<div>
				<label for="role-selection" class="block text-sm font-medium text-gray-900 dark:text-white"
					>Rola</label
				>
				<select
					id="role-selection"
					name="role"
					class="mt-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				>
					<option selected={editUserModal.role === 'customer'} value="customer">Klient</option>
					<option selected={editUserModal.role === 'moderator'} value="moderator">Moderator</option>
					<option selected={editUserModal.role === 'admin'} value="admin">Admin</option>
				</select>
			</div>

			{#if editUserModal.role !== 'admin'}
				<div class="flex items-center mb-4">
					<input
						id="banned"
						name="banned"
						type="checkbox"
						value="true"
						checked={editUserModal.banned}
						class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
					/>
					<label for="banned" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
						>Zablokuj</label
					>
				</div>
			{/if}

			<Button type="submit" class="w-full">Zatwierdź</Button>
			<input type="hidden" hidden value={editUserModal.id} name="id" />
		</form>
	{:else}
		<p>Błąd. Ten użytkownik nie istnieje</p>
	{/if}
</Modal>
