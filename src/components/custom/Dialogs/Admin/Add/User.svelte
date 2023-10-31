<script lang="ts">
	import { Label } from '$shadcn/label';

	import DialogInput from '$components/custom/Dialogs/DialogInput.svelte';
	import Dialog from '$meltui/Dialog/Dialog.svelte';

	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import { createDialog, melt } from '@melt-ui/svelte';

	import DialogDescription from '$meltui/Dialog/DialogDescription.svelte';
	import DialogTitle from '$meltui/Dialog/DialogTitle.svelte';
	import DialogFooter from '$meltui/Dialog/DialogFooter.svelte';
	import DialogTrigger from '$meltui/Dialog/DialogTrigger.svelte';

	import { page } from '$app/stores';

	import type { Address } from '$lib/server/db/schemas/orders';
	import { roleNames } from '$lib/client/constants';
	// import Dialog from '$meltui/Dialog/Dialog.svelte';
	import { Separator } from '$shadcn/separator';
	import type { Optional } from '$types/UtilityTypes';
	import DialogButton from '$meltui/Dialog/DialogButton.svelte';
	import SelectRole from '$meltui/Select/SelectRole.svelte';

	const {
		elements: { trigger, overlay, content, title, description, close, portalled },
		states: { open }
	} = createDialog();

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
	<Dialog {content} {overlay} {close} {portalled} {open}>
		<DialogTitle {title}>Dodaj użytkownika</DialogTitle>
		<DialogDescription {description}>Kliknij przycisk poniżej, aby zapisać zmiany</DialogDescription
		>

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
				<DialogInput label="Imię i nazwisko" name="fullName" />
				<DialogInput label="Email" name="email" type="email" />
				<DialogInput label="Numer telefonu" name="phone" type="tel" />

				<fieldset class="grid items-center grid-cols-6 gap-4">
					<Label for="role" class="flex justify-end col-span-2 text-xs text-right xxs:text-sm"
						>Rola
						<span class="text-red-500">*</span>
					</Label>
					<SelectRole defaultValue="customer" showLabel={false} />
				</fieldset>

				<Separator class="my-2" />

				<DialogInput label="Miasto" name="city" bind:value={address.city} />
				<DialogInput label="Ulica i numer domu" name="street" bind:value={address.street} />
				<DialogInput label="Kod pocztowy" name="zipCode" bind:value={address.zipCode} />

				<DialogFooter>
					<DialogButton>Zapisz</DialogButton>
				</DialogFooter>
			</div>
		</form>
	</Dialog>
</div>
