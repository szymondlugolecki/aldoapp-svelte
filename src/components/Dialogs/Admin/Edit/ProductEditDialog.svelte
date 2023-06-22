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
	import type { Product } from '$lib/server/db/schemas/products';
	import { Textarea } from '$shadcn/textarea';

	export let keyPublicName: string;
	export let key: keyof Product;
	export let cellValue: string | boolean | Address;
	export let cellTextOverride: string | undefined = undefined;
	export let elementId: string | number;

	let keyType: 'text' | 'longtext' | 'hyperlink' | 'category' = 'text';

	switch (key) {
		case 'encodedURL':
			keyType = 'hyperlink';
			break;
		case 'description':
			keyType = 'longtext';
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

				// if (keyType === 'access') {
				// 	data.append('access', accessChecked.toString());
				// }

				// if (keyType === 'address') {
				// 	data.append('address', JSON.stringify(address));
				// }

				return async ({ result, update }) => {
					modalOpen = false;
					handleFormResponse(result, toastId);
					update();
				};
			}}
		>
			<DialogHeader>
				<DialogTitle>Edytuj produkt</DialogTitle>
				<DialogDescription>Kliknij przycisk poniżej, aby zapisać zmiany.</DialogDescription>
			</DialogHeader>
			<div class="py-4">
				{#if keyType === 'text'}
					<div class="grid grid-cols-4 items-center gap-4">
						<Label class="text-right">{keyPublicName}</Label>
						<Input id={key} name={key} value={cellTextOverride || cellValue} class="col-span-3" />
					</div>
				{:else if keyType === 'hyperlink' && typeof cellValue === 'string'}
					<a href={cellValue}>Link</a>
				{:else if keyType === 'hyperlink' && typeof cellValue === 'string'}
					<div class="">
						<Label class="text-right">{keyPublicName}</Label>
						<Textarea placeholder="Wpisz tu opis produktu..." />
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
