<script lang="ts">
	import { Input } from '$shadcn/input';
	import { Label } from '$shadcn/label';
	import { Button } from '$shadcn/button';

	import { page } from '$app/stores';
	import type { Role, User } from '$types';
	import { userRoles } from '$lib/client/constants/dbTypes';
	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import { Switch } from '$shadcn/switch';
	import type { Address } from '$lib/server/db/schemas/orders';
	import { addressParser, isCorrectAddress, isCorrectRole } from '$lib/client/functions';
	import Select from '$meltui/Select.svelte';
	import { roleNames } from '$lib/client/constants';
	import type { Optional } from '$types/UtilityTypes';
	import DialogButton from '$meltui/Dialog/DialogButton.svelte';
	import DialogTrigger from '$meltui/Dialog/DialogTrigger.svelte';
	import Dialog from '$meltui/Dialog/Dialog.svelte';
	import DialogTitle from '$meltui/Dialog/DialogTitle.svelte';
	import DialogDescription from '$meltui/Dialog/DialogDescription.svelte';
	import DialogFooter from '$meltui/Dialog/DialogFooter.svelte';
	import DialogInput from '$components/Dialogs/DialogInput.svelte';
	import { createDialog } from '@melt-ui/svelte';

	export let keyPublicName: string;
	export let key: string;
	export let value: string;
	// export let cellTextOverride: string | undefined = undefined;
	export let user: Pick<
		User,
		'id' | 'email' | 'fullName' | 'access' | 'role' | 'phone' | 'createdAt' | 'address'
	> & {
		adviser?: Pick<User, 'id' | 'email' | 'fullName'>;
	};

	let keyType: 'text' | 'access' | 'role' | 'address' | 'adviser' = 'text';

	const { trigger, portal, overlay, content, close, open, description, title } = createDialog();

	switch (key) {
		case 'access':
			keyType = 'access';
			break;
		case 'role':
			keyType = 'role';
			break;
		case 'adviser':
			keyType = 'adviser';
			break;
		case 'address':
			keyType = 'address';
			break;
	}

	let accessChecked = user.access;
	let isCurrentAdviser = user.adviser ? user.adviser.id === $page.data.user?.id : false;
	let claimAdviserChecked = isCurrentAdviser;

	let address: Address = {
		street: user.address?.street || '',
		zipCode: user.address?.zipCode || '',
		city: user.address?.city || ''
	};

	const noAdminRoles = () => {
		const roles: Optional<typeof roleNames, 'admin'> = { ...roleNames };
		delete roles['admin'];
		return roles;
	};

	const fixedRoleNames = $page.data.user?.role === 'admin' ? roleNames : noAdminRoles();

	let cellValueOverride: string | undefined;
	if (keyType === 'role') {
		cellValueOverride = roleNames[user.role];
	} else if (keyType === 'adviser') {
		cellValueOverride = user.adviser
			? `${user.adviser.fullName}${isCurrentAdviser ? ' (Ty)' : ''}`
			: 'Brak';
	} else if (keyType === 'access') {
		cellValueOverride = user.access ? 'Tak 🟢' : 'Nie 🔴';
	} else if (keyType === 'address') {
		cellValueOverride = addressParser(user.address);
	}
</script>

<div>
	<DialogTrigger {trigger}>{cellValueOverride || value}</DialogTrigger>
	<Dialog {content} {overlay} {close} {portal} {open}>
		<DialogTitle {title}>Edytuj użytkownika</DialogTitle>
		<DialogDescription {description}>Kliknij przycisk poniżej, aby zapisać zmiany</DialogDescription
		>

		<form
			method="post"
			action="?/edit"
			use:enhance={({ formData }) => {
				const toastId = createLoadingToast('please-wait');

				if (keyType === 'access') {
					formData.append('access', accessChecked.toString());
				}

				if (keyType === 'adviser') {
					formData.append('claimAdviser', claimAdviserChecked.toString());
				}

				return async ({ result, update }) => {
					$open = false;

					handleFormResponse(result, toastId);
					update();
				};
			}}
		>
			<div class="flex flex-col space-y-2">
				{#if keyType === 'text'}
					<fieldset class="grid grid-cols-4 items-center gap-4">
						<Label class="text-right">{keyPublicName}</Label>
						<Input id={key} name={key} value={cellValueOverride || value} class="col-span-3" />
					</fieldset>
				{:else if keyType === 'role'}
					<fieldset class="grid grid-cols-6 items-center gap-4">
						<Select
							ariaLabel="Rola"
							placeholder="Rola"
							name="role"
							selectedValue={user.role}
							options={{
								all: fixedRoleNames
							}}
						/>
					</fieldset>
				{:else if keyType === 'access'}
					<fieldset class="flex items-center space-x-2">
						<Switch id="access-switch" bind:rootChecked={accessChecked} rootName={key} />
						<Label for={key}>Dostęp</Label>
					</fieldset>
				{:else if keyType === 'adviser'}
					<fieldset class="flex flex-col space-y-2">
						<div class="flex space-x-2 items-center">
							<Switch id="adviser-switch" bind:rootChecked={claimAdviserChecked} rootName={key} />
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
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="text-right">Miasto</Label>
							<Input id="city" name="city" bind:value={address.city} class="col-span-3" />
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="text-right">Kod pocztowy</Label>
							<Input id="zipCode" name="zipCode" bind:value={address.zipCode} class="col-span-3" />
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
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
