<script lang="ts">
	import { Input } from '$shadcn/input';
	import { Label } from '$shadcn/label';
	import { Button } from '$shadcn/button';

	import { Image } from 'lucide-svelte';

	import DialogInput from '$components/Dialogs/DialogInput.svelte';
	import SelectCategory from '../SelectCategory.svelte';
	import Dialog from '$meltui/Dialog/Dialog.svelte';
	import Select from '$meltui/Select.svelte';
	import { Alert, AlertDescription, AlertTitle } from '$shadcn/alert';

	import { enhance } from '$app/forms';
	import { flyAndScale } from '$lib/client/functions';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import { createDialog } from '@melt-ui/svelte';
	import { X } from 'lucide-svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import DialogDescription from '$meltui/Dialog/DialogDescription.svelte';
	import DialogTitle from '$meltui/Dialog/DialogTitle.svelte';
	import DialogFooter from '$meltui/Dialog/DialogFooter.svelte';
	import DialogTrigger from '$meltui/Dialog/DialogTrigger.svelte';

	import { page } from '$app/stores';

	import type { Address } from '$lib/server/db/schemas/orders';
	import { roleNames } from '$lib/client/constants';
	// import Dialog from '$meltui/Dialog/Dialog.svelte';
	import Separator from '$shadcn/separator/Separator.svelte';
	import type { Optional } from '$types/UtilityTypes';
	import DialogButton from '$meltui/Dialog/DialogButton.svelte';

	let modalOpen = false;

	const { trigger, portal, overlay, content, close, open } = createDialog();

	let address: Address = {
		city: '',
		zipCode: '',
		street: ''
	};

	const noAdminRoles = () => {
		const roles: Optional<typeof roleNames, 'admin'> = { ...roleNames };
		delete roles['admin'];
		return roles;
	};

	const fixedRoleNames = $page.data.user?.role === 'admin' ? roleNames : noAdminRoles();
</script>

<div>
	<DialogTrigger {trigger}>Dodaj użytkownika</DialogTrigger>
	<Dialog {content} {overlay} {close} {portal} {open}>
		<DialogTitle>Dodaj użytkownika</DialogTitle>
		<DialogDescription>Kliknij przycisk poniżej, aby zapisać zmiany</DialogDescription>

		<form
			method="post"
			action="?/add"
			use:enhance={() => {
				const toastId = createLoadingToast('please-wait');
				// data.append('address', JSON.stringify(address));

				return async ({ result, update }) => {
					$open = false;
					handleFormResponse(result, toastId);
					update();
				};
			}}
		>
			<div class="flex flex-col space-y-2">
				<DialogInput keyPublicName="Imię i nazwisko" name="fullName" />
				<DialogInput keyPublicName="Email" name="email" type="email" />
				<DialogInput keyPublicName="Numer telefonu" name="phone" type="tel" />

				<fieldset class="grid grid-cols-6 items-center gap-4">
					<Label for="role" class="flex justify-end text-right text-xs xxs:text-sm col-span-2"
						>Rola
						<span class="text-red-500">*</span>
					</Label>
					<Select
						ariaLabel="Rola"
						placeholder="Rola"
						name="role"
						selectedValue="customer"
						options={{
							all: fixedRoleNames
						}}
					/>
				</fieldset>

				<Separator class="my-2" />

				<DialogInput keyPublicName="Miasto" name="city" bind:value={address.city} />
				<DialogInput keyPublicName="Ulica i numer domu" name="street" bind:value={address.street} />
				<DialogInput keyPublicName="Kod pocztowy" name="zipCode" bind:value={address.zipCode} />

				<DialogFooter>
					<DialogButton>Zapisz</DialogButton>
				</DialogFooter>
			</div>
		</form>
	</Dialog>
</div>
