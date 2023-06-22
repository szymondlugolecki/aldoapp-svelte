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
	import { userPropertySchemas } from '$lib/client/schemas/users';
	import { betterZodParse } from '$lib/client/functions/betterZodParse';
	import toast from 'svelte-french-toast';

	let modalOpen = false;

	export let address: Address;
	$: correctAddress = isCorrectAddress(address) && Object.values(address).every((value) => value);
</script>

<Dialog modal={true} bind:open={modalOpen}>
	<DialogTrigger class="whitespace-pre-line"
		>{correctAddress
			? `${address.street}\n${address.city}, ${address.zipCode}`
			: 'Brak'}</DialogTrigger
	>
	<DialogContent class="sm:max-w-[425px]">
		<form
			method="post"
			action="?/address"
			use:enhance={({ data }) => {
				const toastId = createLoadingToast('please-wait');

				const [parsedAddress, addressParsingError] = betterZodParse(
					userPropertySchemas.address,
					address
				);

				if (addressParsingError) {
					toast.error(addressParsingError[0]);
					return;
				}

				data.append('address', JSON.stringify(parsedAddress));

				return async ({ result, update }) => {
					modalOpen = false;
					handleFormResponse(result, toastId);
					update();
				};
			}}
		>
			<DialogHeader>
				<DialogTitle>Edytuj adres</DialogTitle>
				<DialogDescription>Kliknij przycisk poniżej, aby zapisać zmiany.</DialogDescription>
			</DialogHeader>
			<div class="py-4">
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
			</div>
			<DialogFooter>
				<Button type="submit">Zapisz zmiany</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>
