<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { openedModal, type DefaultModal } from '$lib/client/stores/adminTableChanges';
	import type { AdminUsersTableColumn, User } from '$types';
	import { Boxes, Component, Save, X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	let adminModal: HTMLDialogElement | undefined;

	let modalData: DefaultModal | undefined = undefined;
	let heading = '';

	// store changed
	// if open is true, show modal
	openedModal.subscribe((value) => {
		if (value.open === true && adminModal) {
			adminModal.showModal();
			modalData = value;
			switch (value.type) {
				case 'edit':
					heading = 'Edytuj';
					break;
				case 'create':
					heading = 'Dodaj';
					break;
				case 'delete':
					heading = 'Usuń';
					break;
			}
		}
	});

	// close if clicked outside
	onMount(() => {
		document.addEventListener('click', (e) => e.target === adminModal && adminModal.close());

		return () =>
			document.removeEventListener('click', (e) => e.target === adminModal && adminModal.close());
	});

	export let advisers: AdminUsersTableColumn[] | undefined;
</script>

<dialog bind:this={adminModal} class="py-6 px-6 rounded-lg">
	<form
		class="flex flex-col space-y-3"
		method="post"
		action="?/edit"
		use:enhance={({ form, data, action, cancel, submitter }) => {
			return async ({ result, update }) => {
				// `result` is an `ActionResult` object
				console.log('result', result);
				update();
			};
		}}
	>
		<input type="hidden" name="id" value={modalData?.id} />
		<div class="flex justify-between items-center">
			<span class="text-xl font-semibold label">{heading}</span>
			<button class="btn btn-ghost rounded-full" formmethod="dialog" type="submit"><X /></button>
		</div>
		<span class="text-base mt-2 text-center flex justify-center items-center">
			<Boxes class="text-accent mr-2.5" />{modalData?.elementIdentifier}
			<Component class="text-accent ml-2.5" /></span
		>

		<div class="">
			<label class="label text-base" for="content">{modalData?.name}</label>
			{#if modalData?.contentType === 'phone'}
				<input class="input input-secondary" type="tel" value={modalData ? modalData.value : ''} />
			{:else if modalData?.contentType === 'text'}
				<input class="input input-secondary" type="text" value={modalData ? modalData.value : ''} />
			{:else if modalData?.contentType === 'date'}
				<input
					class="input input-secondary"
					type="datetime-local"
					value={modalData ? modalData.value : ''}
				/>
			{:else if modalData?.contentType === 'email'}
				<input
					class="input input-secondary"
					type="email"
					value={modalData ? modalData.value : ''}
				/>
			{:else if modalData?.contentType === 'checkbox'}
				<input
					class="checkbox checkbox-secondary"
					type="checkbox"
					checked={modalData ? !!modalData.value : false}
				/>
			{:else if modalData?.contentType === 'adviser'}
				<div class="overflow-x-auto w-full">
					<table class="table w-full">
						<!-- head -->
						<thead>
							<tr>
								<th>Doradca</th>
								<th>Wybierz</th>
							</tr>
						</thead>
						<tbody>
							{#if advisers}
								{#each advisers as adviser}
									<tr>
										<td>
											<div class="flex flex-col space-y-1">
												<div class="font-bold">{adviser.fullName}</div>
												<div class="text-sm opacity-50">{adviser.email}</div>
											</div>
										</td>
										<th>
											<button class="btn btn-ghost btn-xs">Wybierz</button>
										</th>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			{:else if modalData?.contentType === 'role'}
				<select
					value={modalData ? modalData.value : null}
					class="select select-bordered w-full min-w-[200px]"
				>
					<option value="customer">Klient</option>
					<option value="driver">Kierowca</option>
					<option value="adviser">Doradca</option>
					{#if $page.data.user?.role === 'admin'}
						<option value="admin">Admin</option>
					{/if}
				</select>
			{/if}
		</div>
		<button class="btn btn-secondary" type="submit">Zapisz <Save class="ml-1.5" /></button>
	</form>
</dialog>
