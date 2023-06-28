<script lang="ts">
	// import {
	// 	Dialog,
	// 	DialogContent,
	// 	DialogDescription,
	// 	DialogHeader,
	// 	DialogTitle,
	// 	DialogTrigger,
	// 	DialogFooter
	// } from '$shadcn/dialog';
	import { Textarea } from '$shadcn/textarea';

	import { Input } from '$shadcn/input';
	import { Label } from '$shadcn/label';
	import { Button } from '$shadcn/button';
	import Select from '$meltui/Select.svelte';

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
	import SelectCategory from '../SelectCategory.svelte';
	import DialogButton from '$meltui/Dialog/DialogButton.svelte';
	import DialogTitle from '$meltui/Dialog/DialogTitle.svelte';
	import DialogDescription from '$meltui/Dialog/DialogDescription.svelte';
	import Dialog from '$meltui/Dialog/Dialog.svelte';
	import DialogTrigger from '$meltui/Dialog/DialogTrigger.svelte';
	import { createDialog } from '@melt-ui/svelte';
	import DialogFooter from '$meltui/Dialog/DialogFooter.svelte';
	import { producentsList } from '$lib/client/constants';

	export let keyPublicName: string;
	export let key: keyof Product;
	export let cellValue: string | boolean | Address;
	export let cellTextOverride: string | undefined = undefined;
	export let elementId: string | number;

	const { trigger, portal, overlay, content, close, open } = createDialog();

	let keyType: 'text' | 'longtext' | 'hyperlink' | 'categories' | 'number' | 'producent' = 'text';

	$: switch (key) {
		case 'encodedURL':
			keyType = 'hyperlink';
			break;
		case 'description':
			keyType = 'longtext';
			break;
		case 'price':
			keyType = 'number';
			break;
		case 'category':
			keyType = 'categories';
			break;
		case 'subcategory':
			keyType = 'categories';
			break;
		case 'weight':
			keyType = 'number';
			break;
		case 'producent':
			keyType = 'producent';
			break;
	}
</script>

<div>
	<DialogTrigger {trigger}>{cellTextOverride || cellValue}</DialogTrigger>
	<Dialog {content} {overlay} {close} {portal} {open}>
		<DialogTitle>Edytuj użytkownika</DialogTitle>
		<DialogDescription>Kliknij przycisk poniżej, aby zapisać zmiany</DialogDescription>

		<form
			method="post"
			action="?/edit"
			use:enhance={({ formData }) => {
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
				{#if keyType === 'text'}
					<div class="grid grid-cols-4 items-center gap-4">
						<Label class="text-right">{keyPublicName}</Label>
						<Input id={key} name={key} value={cellTextOverride || cellValue} class="col-span-3" />
					</div>
				{:else if keyType === 'hyperlink' && typeof cellValue === 'string'}
					<a href={cellValue}>Link</a>
				{:else if keyType === 'number' && typeof cellValue === 'string'}
					<div class="grid grid-cols-4 items-center gap-4">
						<Label class="text-right">{keyPublicName}</Label>
						<Input
							id={key}
							name={key}
							value={cellTextOverride || cellValue}
							type="number"
							class="col-span-3"
							step="0.01"
						/>
					</div>
				{:else if keyType === 'longtext' && (cellValue === null || typeof cellValue === 'string')}
					<Textarea value={cellValue} name={key} id={key} placeholder="Tu wpisz opis produktu..." />
				{:else if keyType === 'categories' && typeof cellValue === 'string'}
					<SelectCategory />
				{:else if keyType === 'producent' && typeof cellValue === 'string'}
					<fieldset class="space-y-2">
						<div class="grid grid-cols-6 items-center gap-4">
							<Label
								for="producent"
								class="text-right flex justify-end col-span-2 text-xs xss:text-sm xs:text-base"
								>Producent
								<span class="text-red-500">*</span>
							</Label>
							<div class="col-span-4">
								<Select
									selectedValue={cellValue}
									options={{ all: producentsList }}
									placeholder="Wybierz producenta"
									ariaLabel="Producent"
									name="producent"
								/>
							</div>
						</div>
					</fieldset>
				{/if}

				<DialogFooter>
					<DialogButton>Zapisz</DialogButton>
				</DialogFooter>
			</div>
			<input type="hidden" hidden value={elementId} name="id" />
		</form>
	</Dialog>
</div>
