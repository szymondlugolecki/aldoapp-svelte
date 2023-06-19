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
	import type { Address } from '$lib/server/db/schemas/orders';
	import { isCorrectAddress, isCorrectRole } from '$lib/client/functions';
	import { Separator } from '$shadcn/separator';

	export let elementType: 'user' | 'product' | 'promoCode';

	const elementTitles = {
		user: 'Dodaj użytkownika',
		product: 'Dodaj produkt',
		promoCode: 'Dodaj kod rabatowy',
		order: 'Dodaj zamówienie'
	};

	let modalOpen = false;

	let address: Address = {
		city: '',
		zipCode: '',
		street: ''
	};
</script>

<Dialog modal={true} bind:open={modalOpen}>
	<DialogTrigger>{elementTitles[elementType]}</DialogTrigger>
	<DialogContent class="sm:max-w-[425px]">
		<form
			method="post"
			action="?/add"
			use:enhance={({ data }) => {
				const toastId = createLoadingToast('please-wait');

				if (elementType === 'user') {
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
				<DialogTitle>{elementTitles[elementType]}</DialogTitle>
				<DialogDescription>Kliknij przycisk poniżej, aby zapisać zmiany.</DialogDescription>
			</DialogHeader>
			<div class="py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="fullName" class="text-right">Imię i nazwisko</Label>
					<Input id="fullName" name="fullName" class="col-span-3" />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="email" class="text-right">Email</Label>
					<Input type="email" id="email" name="email" class="col-span-3" />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="phone" class="text-right">Telefon</Label>
					<Input type="tel" id="phone" name="phone" class="col-span-3" />
				</div>

				<div class="grid grid-cols-4 items-center gap-4">
					<Label class="text-right">Miasto</Label>
					<Input type="text" class="col-span-3" bind:value={address.city} />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label class="text-right">Ulica i numer domu</Label>
					<Input type="text" class="col-span-3" bind:value={address.street} />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label class="text-right">Kod pocztowy</Label>
					<Input type="text" class="col-span-3" bind:value={address.zipCode} />
				</div>

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
