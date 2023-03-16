<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import { drawer } from '$lib/client/stores/adminDrawer';
	import { X } from 'lucide-svelte';
</script>

<form
	class="flex flex-col space-y-4"
	method="post"
	action="?/add"
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
	<div class="flex justify-between items-center">
		<h3 class="text-xl font-medium p-0 text-base-content">Dodaj nowego użytkownika</h3>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<label
			tabindex="0"
			for="admin-drawer"
			class="btn btn-ghost rounded-full px-3"
			on:keypress={function (event) {
				if (event.key === 'Enter') {
					event.currentTarget.click();
				}
			}}><X /></label
		>
	</div>

	<div>
		<label for="name" class="label label-text"> Imię i nazwisko </label>
		<input
			type="text"
			name="name"
			placeholder="np. Jan Kowalski"
			class="input input-bordered w-full text-base-content"
			required
		/>
	</div>
	<div>
		<label for="name" class="label label-text"> Email </label>
		<input
			type="email"
			name="email"
			placeholder="np. jan.kowalski@gmail.com"
			class="input input-bordered w-full text-base-content"
			required
		/>
	</div>
	<div>
		<label for="name" class="label label-text"> Rola </label>
		<select id="role-selection" name="role" class="select select-bordered w-full">
			<option selected value="customer">Klient</option>
			<option value="moderator">Moderator</option>
			{#if $page.data.user?.role === 'admin'}
				<option value="admin">Admin</option>
			{/if}
		</select>
	</div>
	<button type="submit" class="btn btn-primary w-full">Dodaj</button>
</form>
