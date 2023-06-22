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
	import type { Role } from '$types';
	import { userRoles } from '$lib/client/constants/dbTypes';
	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import { Switch } from '$shadcn/switch';
	import type { Address } from '$lib/server/db/schemas/orders';
	import { isCorrectAddress, isCorrectRole } from '$lib/client/functions';

	export let keyPublicName: string;
	export let key: string;
	export let cellValue: string | boolean | Address;
	export let cellTextOverride: string | undefined = undefined;
	export let elementId: string | number;

	let keyType: 'text' | 'access' | 'role' | 'address' = 'text';

	switch (key) {
		case 'access':
			keyType = 'access';
			break;
		case 'role':
			keyType = 'role';
			break;
		case 'access':
			keyType = 'access';
			break;
		case 'access':
			keyType = 'access';
			break;
		case 'address':
			keyType = 'address';
			break;
	}

	let modalOpen = false;
	let accessChecked = typeof cellValue === 'boolean' ? cellValue : false;

	let address: Address = {
		city: isCorrectAddress(cellValue) ? cellValue.city : '',
		zipCode: isCorrectAddress(cellValue) ? cellValue.zipCode : '',
		street: isCorrectAddress(cellValue) ? cellValue.street : ''
	};
</script>

<Dialog modal={true} bind:open={modalOpen}>
	<DialogTrigger>{cellTextOverride || cellValue}</DialogTrigger>
	<DialogContent class="sm:max-w-[425px]">
		<form
			method="post"
			action="?/edit"
			use:enhance={({ data }) => {
				const toastId = createLoadingToast('please-wait');

				if (keyType === 'access') {
					data.append('access', accessChecked.toString());
				}

				if (keyType === 'address') {
					data.append('address', JSON.stringify(address));
				}

				return async ({ result, update }) => {
					modalOpen = false;
					handleFormResponse(result, toastId);
					update();
				};
			}}
		>
			<DialogHeader>
				<DialogTitle>Edytuj użytkownika</DialogTitle>
				<DialogDescription>Kliknij przycisk poniżej, aby zapisać zmiany.</DialogDescription>
			</DialogHeader>
			<div class="py-4">
				{#if keyType === 'text'}
					<div class="grid grid-cols-4 items-center gap-4">
						<Label class="text-right">{keyPublicName}</Label>
						<Input id={key} name={key} value={cellTextOverride || cellValue} class="col-span-3" />
					</div>
				{:else if keyType === 'role' && isCorrectRole(cellValue)}
					<select name={key} class="">
						<option selected={cellValue === 'customer'} value="customer">Klient</option>
						<option selected={cellValue === 'driver'} value="driver">Kierowca</option>
						<option selected={cellValue === 'adviser'} value="adviser">Doradca</option>
						{#if $page.data.user?.role === 'admin'}
							<option selected={cellValue === 'admin'} value="admin">Admin</option>
						{/if}
					</select>
				{:else if keyType === 'access' && typeof cellValue === 'boolean'}
					<div class="flex items-center space-x-2">
						<Switch id="access-switch" bind:rootChecked={accessChecked} rootName={key} />
						<Label for={key}>Dostęp</Label>
					</div>
				{:else if isCorrectAddress(cellValue)}
					<div class="grid gap-4 py-4">
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="text-right">Miasto</Label>
							<Input id="city" bind:value={address.city} class="col-span-3" />
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="text-right">Kod pocztowy</Label>
							<Input id="zipCode" bind:value={address.zipCode} class="col-span-3" />
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="text-right">Ulica i numer domu</Label>
							<Input id="street" bind:value={address.street} class="col-span-3" />
						</div>
					</div>
				{/if}
			</div>
			<DialogFooter>
				<Button type="submit">Zapisz zmiany</Button>
			</DialogFooter>
			<input type="hidden" hidden value={elementId} name="id" />
		</form>
	</DialogContent>
</Dialog>
