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
	import { Textarea } from '$shadcn/textarea';
	import DialogInput from '$components/Dialogs/DialogInput.svelte';
	import Separator from '$shadcn/separator/Separator.svelte';
	import SelectCategory from '../SelectCategory.svelte';

	let modalOpen = false;
</script>

<Dialog modal={true} bind:open={modalOpen}>
	<DialogTrigger>Dodaj produkt</DialogTrigger>
	<DialogContent class="sm:max-w-[425px]">
		<form
			method="post"
			action="?/add"
			use:enhance={({ data }) => {
				const toastId = createLoadingToast('please-wait');

				return async ({ result, update }) => {
					modalOpen = false;
					handleFormResponse(result, toastId);
					update();
				};
			}}
		>
			<DialogHeader>
				<DialogTitle>Add a fruit</DialogTitle>
				<!-- <DialogDescription>Kliknij przycisk poniżej, aby zapisać zmiany.</DialogDescription> -->
			</DialogHeader>
			<div class="py-4">
				<!-- <DialogInput keyPublicName="Nazwa" name="name" />
				<DialogInput keyPublicName="Kod produktu" name="symbol" />
				<DialogInput keyPublicName="Cena" name="price" type="number" />
				<DialogInput keyPublicName="Waga (kg)" name="weight" type="number" /> -->

				<SelectCategory />

				<Separator class="my-1" />
				<!-- 
				<div class="">
					<Label for="description" class="text-right">Opis</Label>
					<Textarea id="description" name="description" placeholder="Wpisz tu opis produktu..." />
				</div> -->

				<!-- <div class="grid grid-cols-4 items-center gap-4">
					<Label class="text-right">Rola</Label>
					<select name="role" class="">
						<option selected value="customer">Klient</option>
						<option value="driver">Kierowca</option>
						<option value="adviser">Doradca</option>
						{#if $page.data.user?.role === 'admin'}
							<option value="admin">Admin</option>
						{/if}
					</select>
				</div> -->
			</div>
			<DialogFooter>
				<Button type="submit">Add</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>
