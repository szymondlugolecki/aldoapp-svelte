<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
		DialogFooter
	} from '$shadcn/dialog';

	import { Input } from '$shadcn/input';
	import { Label } from '$shadcn/label';
	import { Button } from '$shadcn/button';

	import { page } from '$app/stores';

	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import type { Address } from '$lib/server/db/schemas/orders';
	import DialogInput from '$components/Dialogs/DialogInput.svelte';

	let modalOpen = false;

	let address: Address = {
		city: '',
		zipCode: '',
		street: ''
	};
</script>

<Dialog modal={true} bind:open={modalOpen}>
	<DialogTrigger>Dodaj użytkownika</DialogTrigger>
	<DialogContent class="sm:max-w-[425px]">
		<form
			method="post"
			action="?/add"
			use:enhance={({ data }) => {
				const toastId = createLoadingToast('please-wait');
				data.append('address', JSON.stringify(address));

				return async ({ result, update }) => {
					modalOpen = false;
					handleFormResponse(result, toastId);
					update();
				};
			}}
		>
			<DialogHeader>
				<DialogTitle>Dodaj użytkownika</DialogTitle>
				<DialogDescription>Kliknij przycisk poniżej, aby zapisać zmiany.</DialogDescription>
			</DialogHeader>
			<div class="py-4">
				<DialogInput keyPublicName="Imię i nazwisko" name="fullName" />
				<DialogInput keyPublicName="Email" name="email" type="email" />
				<DialogInput keyPublicName="Numer telefonu" name="phone" type="tel" />

				<DialogInput keyPublicName="Miasto" bind:value={address.city} />
				<DialogInput keyPublicName="Ulica i numer domu" bind:value={address.street} />
				<DialogInput keyPublicName="Kod pocztowy" bind:value={address.zipCode} />

				<div class="grid grid-cols-4 items-center gap-4">
					<Label class="text-right">Rola</Label>
					<select name="role" class="">
						<option selected value="customer">Klient</option>
						<option value="driver">Kierowca</option>
						<option value="adviser">Doradca</option>
						{#if $page.data.user?.role === 'admin'}
							<option value="admin">Admin</option>
						{/if}
					</select>
				</div>
			</div>
			<DialogFooter>
				<Button type="submit">Dodaj</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>
