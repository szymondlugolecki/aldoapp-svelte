<script lang="ts">
	import { enhance } from '$app/forms';
	import { isValidObject } from '$lib/client/functions';
	import { errorToast, successToast } from '$lib/client/functions/toasts';
	import { Button, Modal, Label, Input } from 'flowbite-svelte';

	export let newUserModalOpen: boolean;
</script>

<!-- New User Modal -->
<Modal bind:open={newUserModalOpen} size="xs" autoclose={false} class="w-full">
	<form
		class="flex flex-col space-y-6"
		method="post"
		action="?/add"
		use:enhance={({ form, data, action, cancel }) => {
			return async ({ result, update }) => {
				if (result.type === 'failure') {
					if (isValidObject(result.data?.errors)) {
						const errorList = Object.values(result.data?.errors).flatMap((x) => x);
						if (errorList.length) {
							const formatErrors = '• ' + errorList.join('\n• ');
							errorToast({ title: 'Wystąpił błąd', description: formatErrors });
						}
					}
				} else if (result.type === 'success') {
					successToast({ title: 'Sukces', description: 'Pomyślnie dodano użytkownika' });
				}
				update();
				newUserModalOpen = false;
			};
		}}
	>
		<h3 class="text-xl font-medium 1text-gray-900 dark:text-white p-0">Dodaj nowego użytkownika</h3>
		<Label class="space-y-2">
			<span>Imię i nazwisko</span>
			<Input type="text" name="name" placeholder="Jan Kowalski" required />
		</Label>
		<Label class="space-y-2">
			<span>Email</span>
			<Input type="email" name="email" placeholder="jan.kowalski@gmail.com" required />
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
				<option selected value="customer">Klient</option>
				<option value="moderator">Moderator</option>
				<option value="admin">Admin</option>
			</select>
		</div>
		<Button type="submit" class="w-full">Dodaj</Button>
	</form>
</Modal>
