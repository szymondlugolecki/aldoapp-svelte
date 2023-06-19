<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { closeDrawer, drawer, getPropertyKey } from '$lib/client/stores/adminDrawer';
	import ModalHeader from '../ModalHeader.svelte';
	import type { User } from '$types';
	import { getRoleRank } from '$lib/client/functions';
	import AdviserSelection from './AdviserSelection.svelte';

	export let user: Omit<User, 'adviserId' | 'updatedAt'> & {
		adviser: {
			id: string;
			fullName: string;
			email: string;
		} | null;
	};
	$: key = $drawer?.action === 'edit' && $drawer?.type === 'user' && $drawer.key;

	$: console.log('drawer key', key);

	// role of the person that is editing the user
	const editorRole = $page.data.user?.role;

	// whether the user that is being edited is of lower role than the editor
	$: editorIsOfHigherRole = editorRole && getRoleRank(user.role) < getRoleRank(editorRole);
</script>

{#if editorIsOfHigherRole || $page.data.user?.id === user.id}
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
				closeDrawer();
				update();
			};
		}}
	>
		<ModalHeader title="Edytuj użytkownika" />

		{#if key === 'fullName'}
			<div>
				<label for="fullName" class="label label-text"> Imię i nazwisko </label>
				<input
					type="text"
					name="fullName"
					class="input input-bordered w-full text-base-content"
					required
					value={user.fullName}
				/>
			</div>
		{:else if key === 'email'}
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
		{:else if key === 'phone'}
			<div>
				<label for="phone" class="label label-text"> Numer telefonu </label>
				<input
					type="tel"
					name="phone"
					class="input input-bordered w-full text-base-content"
					value={user.phone}
					required
				/>
			</div>
		{:else if key === 'role'}
			<div>
				<label for="name" class="label label-text"> Rola </label>
				<select id="role-selection" name="role" class="select select-bordered w-full">
					<option selected={user.role === 'customer'} value="customer">Klient</option>
					<option selected={user.role === 'driver'} value="driver">Kierowca</option>
					<option selected={user.role === 'adviser'} value="adviser">Doradca</option>
					{#if $page.data.user?.role === 'admin'}
						<option selected={user.role === 'admin'} value="admin">Admin</option>
					{/if}
				</select>
			</div>
		{:else if key === 'access'}
			<div class="form-control max-w-[90px]">
				<label class="cursor-pointer label">
					<span class="label-text">Dostęp</span>
					<input
						id="access"
						name="access"
						type="checkbox"
						checked={user.access}
						class="checkbox checkbox-success"
					/>
				</label>
			</div>
		{:else if key === 'adviserId'}
			<AdviserSelection />
		{/if}

		{#if key !== 'adviserId'}
			<button type="submit" class="btn btn-primary w-full">Edytuj</button>
		{/if}
		<input type="hidden" hidden value={user.id} name="id" />
	</form>
{:else}
	<span>Nie możesz edytować kogoś z taką samą lub wyższą rolą</span>
{/if}
