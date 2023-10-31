<script lang="ts">
	import { Input } from '$shadcn/input';
	import { Label } from '$shadcn/label';

	import { page } from '$app/stores';
	import type { User } from '$types';
	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import type { Address } from '$lib/server/db/schemas/orders';
	import { parseAddress } from '$lib/client/functions';
	import { roleNames } from '$lib/client/constants';
	import DialogButton from '$meltui/Dialog/DialogButton.svelte';
	import DialogTrigger from '$meltui/Dialog/DialogTrigger.svelte';
	import Dialog from '$meltui/Dialog/Dialog.svelte';
	import DialogTitle from '$meltui/Dialog/DialogTitle.svelte';
	import DialogDescription from '$meltui/Dialog/DialogDescription.svelte';
	import DialogFooter from '$meltui/Dialog/DialogFooter.svelte';
	import { createDialog, melt } from '@melt-ui/svelte';
	import SelectRole from '$meltui/Select/SelectRole.svelte';
	import ClaimAdviser from '$meltui/Switch/ClaimAdviser.svelte';
	import PhoneInput from '$meltui/Input/PhoneInput.svelte';

	export let label: string;
	export let key: string;
	export let value: string;
	export let user: Pick<User, 'id' | 'email' | 'fullName' | 'role' | 'phone' | 'createdAt'> & {
		adviser?: Pick<User, 'id' | 'email' | 'fullName'>;
	} & { address: Address };

	let keyType: 'text' | 'access' | 'role' | 'address' | 'adviser' | 'phone' | null = null;

	const {
		elements: { trigger, overlay, content, title, description, close, portalled },
		states: { open }
	} = createDialog();

	switch (key) {
		case 'role':
			keyType = 'role';
			break;
		case 'adviser':
			keyType = 'adviser';
			break;
		case 'address':
			keyType = 'address';
			break;
		case 'fullName':
			keyType = 'text';
			break;
		case 'email':
			keyType = 'text';
			break;
		case 'phone':
			keyType = 'phone';
			break;
	}

	let isCurrentAdviser = user.adviser ? user.adviser.id === $page.data.user?.id : false;
	let claimAdviserChecked = isCurrentAdviser;

	let address: Address = {
		street: user.address?.street || '',
		zipCode: user.address?.zipCode || '',
		city: user.address?.city || ''
	};

	let cellOverride: string | undefined | null;
	if (keyType === 'role') {
		cellOverride = roleNames[user.role];
	} else if (keyType === 'adviser') {
		cellOverride = user.adviser
			? `${user.adviser.fullName}${isCurrentAdviser ? ' (Ty)' : ''}`
			: 'Brak';
	} else if (keyType === 'address') {
		cellOverride = parseAddress(user.address);
	}
</script>

<div>
	<DialogTrigger {trigger}>{cellOverride || value}</DialogTrigger>
	<Dialog {content} {overlay} {close} {portalled} {open}>
		<DialogTitle {title}>Edytuj użytkownika</DialogTitle>
		<DialogDescription {description}>Kliknij przycisk poniżej, aby zapisać zmiany</DialogDescription
		>

		<form
			method="post"
			action="?/edit"
			use:enhance={() => {
				const toastId = createLoadingToast('please-wait');

				// if (keyType === 'access') {
				// 	formData.append('access', accessChecked.toString());
				// }

				// if (keyType === 'adviser') {
				// 	formData.append('claimAdviser', claimAdviserChecked.toString());
				// }

				return async ({ result, update }) => {
					$open = false;

					handleFormResponse(result, toastId);
					update();
				};
			}}
		>
			<div class="flex flex-col space-y-2">
				{#if keyType === 'text'}
					<fieldset class="grid items-center grid-cols-4 gap-4">
						<Label class="text-right">{label}</Label>
						<Input id={key} name={key} value={cellOverride || value} class="col-span-3" />
					</fieldset>
				{:else if keyType === 'role'}
					<fieldset class="flex">
						<SelectRole defaultValue={user.role} />
					</fieldset>
				{:else if keyType === 'phone'}
					<fieldset class="flex">
						<PhoneInput defaultRole={user.phone} />
					</fieldset>
				{:else if keyType === 'adviser'}
					<fieldset class="flex flex-col space-y-2">
						<div class="flex items-center space-x-2">
							<ClaimAdviser bind:isAdviser={claimAdviserChecked} />
							<Label for={key}>Zostań doradcą</Label>
						</div>
						<p class="text-sm">
							Obecny doradca: {user.adviser
								? `${user.adviser.fullName}${isCurrentAdviser ? ' (Ty)' : ''}`
								: 'Brak'}
						</p>
					</fieldset>
				{:else if keyType === 'address'}
					<fieldset class="grid gap-4 py-4">
						<div class="grid items-center grid-cols-4 gap-4">
							<Label class="text-right">Miasto</Label>
							<Input id="city" name="city" bind:value={address.city} class="col-span-3" />
						</div>
						<div class="grid items-center grid-cols-4 gap-4">
							<Label class="text-right">Kod pocztowy</Label>
							<Input id="zipCode" name="zipCode" bind:value={address.zipCode} class="col-span-3" />
						</div>
						<div class="grid items-center grid-cols-4 gap-4">
							<Label class="text-right">Ulica i numer domu</Label>
							<Input id="street" name="street" bind:value={address.street} class="col-span-3" />
						</div>
					</fieldset>
				{/if}

				<DialogFooter>
					<DialogButton>Zapisz</DialogButton>
				</DialogFooter>
			</div>
			<input type="hidden" hidden value={user.id} name="id" />
		</form>
	</Dialog>
</div>
