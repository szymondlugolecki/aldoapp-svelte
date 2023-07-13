<script lang="ts">
	import { Label } from '$shadcn/label';
	import { Image } from 'lucide-svelte';

	import DialogInput from '$components/Dialogs/DialogInput.svelte';
	import SelectCategory from '../SelectCategory.svelte';
	import Dialog from '$meltui/Dialog/Dialog.svelte';
	import Select from '$meltui/Select.svelte';
	import { Alert, AlertDescription, AlertTitle } from '$shadcn/alert';

	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import { createDialog } from '@melt-ui/svelte';

	import DialogDescription from '$meltui/Dialog/DialogDescription.svelte';
	import DialogTitle from '$meltui/Dialog/DialogTitle.svelte';
	import DialogFooter from '$meltui/Dialog/DialogFooter.svelte';
	import DialogTrigger from '$meltui/Dialog/DialogTrigger.svelte';
	import DialogButton from '$meltui/Dialog/DialogButton.svelte';
	import { betterZodParse } from '$lib/client/functions/betterZodParse';
	import toast from 'svelte-french-toast';
	import { addProductSchema } from '$lib/client/schemas/products';

	const { trigger, portal, overlay, content, close, open, title, description } = createDialog();
</script>

<div>
	<DialogTrigger {trigger}>Dodaj produkt</DialogTrigger>
	<Dialog {content} {overlay} {close} {portal} {open}>
		<DialogTitle {title}>Dodaj produkt</DialogTitle>

		<DialogDescription {description}>Kliknij przycisk poniżej, aby zapisać zmiany</DialogDescription
		>

		<form
			method="post"
			action="?/add"
			use:enhance={({ cancel, formData }) => {
				const toastId = createLoadingToast('please-wait');
				// formData.append('address', JSON.stringify(address));

				const entries = Object.fromEntries(formData);

				const fixedEntries = {
					...entries,
					price: Number(typeof entries.price === 'string' ? entries.price.replace(',', '.') : null),
					weight: Number(
						typeof entries.weight === 'string' ? entries.weight.replace(',', '.') : null
					)
				};

				console.log('fixedEntries', fixedEntries);

				const [, productParseError] = betterZodParse(addProductSchema, fixedEntries);

				if (productParseError) {
					toast.error(productParseError[0], { duration: 3000, id: toastId });
					return cancel();
				}

				return async ({ result, update }) => {
					$open = false;
					handleFormResponse(result, toastId);
					update();
				};
			}}
		>
			<div class="flex flex-col space-y-2">
				<DialogInput name="name" keyPublicName="Nazwa" required />
				<DialogInput name="symbol" keyPublicName="Kod produktu" required />
				<DialogInput name="price" keyPublicName="Cena" type="number" step="0.01" required />
				<DialogInput name="weight" keyPublicName="Waga (kg)" type="number" required />

				<fieldset class="grid grid-cols-6 items-center gap-4">
					<Label
						for="category"
						class="text-right flex justify-end col-span-2 text-xs xss:text-sm xs:text-base"
						>Producent
						<span class="text-red-500">*</span>
					</Label>
					<div class="col-span-4">
						<Select
							ariaLabel="Producent"
							placeholder="Wybierz producenta"
							name="producent"
							options={{
								all: {
									deheus: 'De Heus',
									unknown: 'Nieznany'
								}
							}}
						/>
					</div>
				</fieldset>
				<SelectCategory />

				<!-- <Alert>
					<Image class="w-4 h-4" />
					<AlertTitle>Zdjęcia</AlertTitle>
					<AlertDescription class="text-sm xs:text-base"
						>Zdjęcia produktu możesz dodać edytując go po dodaniu</AlertDescription
					>
				</Alert> -->

				<DialogFooter>
					<DialogButton>Zapisz</DialogButton>
				</DialogFooter>
			</div>
		</form>
	</Dialog>
</div>
