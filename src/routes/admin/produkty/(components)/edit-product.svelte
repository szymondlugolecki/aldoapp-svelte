<script lang="ts">
	import { Textarea } from '$shadcn/textarea';

	import { Input } from '$shadcn/input';

	import * as Form from '$shadcn/form';
	import * as Dialog from '$shadcn/dialog';

	import { fodderCategories2, fodderNames, producentsList } from '$lib/client/constants';
	import { cn } from '$lib/client/functions';
	import { products$ } from '$lib/client/schemas';
	import { buttonVariants } from '$components/ui/button';
	import { superForm, type SuperValidated, type Infer, fileProxy } from 'sveltekit-superforms';
	import type { EditProductForm } from '$lib/client/schemas/products';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Select from '$components/ui/select';
	import SelectCategories from './select-categories-edit.svelte';
	import SelectProducent from './select-producent.svelte';
	import { toast } from 'svelte-sonner';

	type ExtendedProduct = import('../$types').PageServerData['products'];

	export let label: string;
	export let key: keyof ExtendedProduct[number];
	export let value: ExtendedProduct[number][keyof ExtendedProduct[number]];
	export let product: ExtendedProduct[number];

	export { product as item };

	export let superform: SuperValidated<Infer<EditProductForm>>;

	let cellOverride: string | undefined;

	if (key === 'category') {
		cellOverride = fodderNames[product.category];
	} else if (key === 'subcategory') {
		cellOverride =
			product.subcategory && product.subcategory in fodderCategories2[product.category]
				? // @ts-ignore
				  fodderCategories2[product.category][product.subcategory]
				: 'Brak';
	} else if (key === 'producent') {
		cellOverride = producentsList[product.producent];
	} else if (key === 'images') {
		cellOverride = 'Brak zdjęć';
	} else if (key === 'description') {
		cellOverride = product.description ? '...' : 'Brak';
	} else if (key === 'hidden') {
		cellOverride = product.hidden ? 'Tak' : 'Nie';
	}

	let open = false;

	const form = superForm(superform, {
		id: `${key}-${product.id}`,
		validators: zodClient(products$.editForm),
		onUpdated: ({ form: f }) => {
			console.log(f, f.message, f.posted, f.errors);
			if (f.valid) {
				open = false;
				// toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
				toast.success(`Sukces`);
			} else {
				toast.error('Błąd');
			}
		},
		onSubmit: ({ formData }) => {
			formData.set('id', product.id.toString());
		}
	});
	const { form: formData, enhance, delayed, submitting } = form;

	$formData.id = product.id;

	// switch (key) {
	// 	case 'id':
	// 		break;
	// 	case 'createdAt':
	// 		break;
	// 	case 'adviser':
	// 		break;
	// 	case 'address':
	// 		$formData.city = user.address.city;
	// 		$formData.zipCode = user.address.zipCode;
	// 		$formData.street = user.address.street;
	// 		break;
	// 	case 'role':
	// 		$formData.role = user.role;
	// 		break;
	// 	default:
	// 		$formData[key] = user[key];
	// 		break;
	// }

	$: isHidden = $formData.hidden
		? {
				label: 'Ukryty',
				value: $formData.hidden
		  }
		: undefined;

	const file = fileProxy(form, 'images');
</script>

<Dialog.Root bind:open closeOnOutsideClick={false}>
	{#if key !== 'images' || (key === 'images' && !product.image)}
		<Dialog.Trigger class={cn(buttonVariants({ variant: 'link' }), 'whitespace-pre')}>
			{cellOverride || value}
		</Dialog.Trigger>
	{:else if product.image}
		<Dialog.Trigger class="flex items-center justify-center p-0">
			<div class="h-20 overflow-hidden rounded-lg aspect-3/4">
				<img src={product.image} alt="" class="object-cover object-center w-full h-full" />
			</div>
		</Dialog.Trigger>
	{/if}
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edytuj produkt</Dialog.Title>
			<Dialog.Description>Po dokonaniu zmian wciśnij przycisk Zapisz</Dialog.Description>
		</Dialog.Header>

		<form method="POST" action="?/edit" use:enhance class="flex flex-col gap-y-2">
			{#if key === 'name'}
				<Form.Field {form} name={key}>
					<Form.Control let:attrs>
						<Form.Label>{label}</Form.Label>
						<Input {...attrs} bind:value={$formData.name} required spellcheck="false" />
					</Form.Control>
					<Form.Description>Nazwa produktu w sklepie</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			{:else if key === 'symbol'}
				<Form.Field {form} name={key}>
					<Form.Control let:attrs>
						<Form.Label>{label}</Form.Label>
						<Input {...attrs} required bind:value={$formData.symbol} spellcheck="false" />
					</Form.Control>
					<Form.Description>Kod produktu w sklepie</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			{:else if key === 'encodedURL'}
				<a href={product.encodedURL} class="underline">Link</a>
			{:else if key === 'description'}
				<Form.Field {form} name={key}>
					<Form.Control let:attrs>
						<Form.Label>Bio</Form.Label>
						<Textarea
							{...attrs}
							placeholder="Tu wpisz opis produktu..."
							class="resize-none"
							bind:value={$formData.description}
							spellcheck="false"
						/>
						<Form.Description>Możesz nieobowiązkowo dodać opis produktu</Form.Description>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{:else if key === 'category' || key === 'subcategory'}
				<SelectCategories {form} />
			{:else if key === 'price'}
				<Form.Field {form} name={key}>
					<Form.Control let:attrs>
						<Form.Label>{label}</Form.Label>
						<Input
							{...attrs}
							required
							bind:value={$formData.price}
							type="number"
							spellcheck="false"
							step="0.01"
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{:else if key === 'weight'}
				<Form.Field {form} name={key}>
					<Form.Control let:attrs>
						<Form.Label>{label}</Form.Label>
						<Input
							{...attrs}
							required
							bind:value={$formData.weight}
							type="number"
							spellcheck="false"
							step="0.01"
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{:else if key === 'producent'}
				<!-- <SelectProducent bind:combobox={producentCombobox} /> -->
				<SelectProducent {form} />
			{:else if key === 'image'}
				<Form.Field {form} name="images">
					<Form.Control let:attrs>
						<Form.Label>Zdjęcie</Form.Label>
						<Input
							{...attrs}
							type="file"
							accept="image/png, image/jpg, image/jpeg, image/webp, image/avif"
							bind:files={$file}
						/>
					</Form.Control>
					<Form.Description>Wybierz zdjęcie produktu</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			{:else if key === 'hidden'}
				<Form.Field {form} name="hidden">
					<Form.Control let:attrs>
						<Form.Label>Ukryty</Form.Label>

						<Select.Root
							selected={isHidden}
							onSelectedChange={(v) => {
								v && ($formData.hidden = v.value);
							}}
						>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder="Wybierz czy ukryć przedmiot" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value={false} label="Nie" />
								<Select.Item value={true} label="Tak" />
							</Select.Content>
						</Select.Root>
						<input hidden bind:value={$formData.hidden} name={attrs.name} />
					</Form.Control>
					<Form.Description>Ukryte produkty nie będą wyświetlane w sklepie.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			{/if}

			<Form.Field {form} name="id" hidden={true}>
				<Form.Control let:attrs>
					<input {...attrs} type="hidden" value={product.id} />
				</Form.Control>
			</Form.Field>

			<!-- <Feedback message={$message} {timeout} /> -->

			<div class="flex justify-end">
				<Form.Button class="w-20" disabled={$submitting}>
					{#if $delayed}
						<Spinner />
					{:else}
						Zapisz
					{/if}
				</Form.Button>
			</div>
			<!-- </Form.Root> -->
		</form>
	</Dialog.Content>

	<!-- <div class="flex flex-col gap-y-2">
	
				{#if keyType === 'hyperlink'}
					<a href={product.encodedURL}>Link</a>
				{:else if keyType === 'number'}
					<div class="grid items-center grid-cols-4 gap-4">
						<Label class="text-right">{label}</Label>
						<Input id={key} name={key} {value} type="number" class="col-span-3" step="0.01" />
					</div>
				{:else if keyType === 'longtext' && typeof value === 'string'}
					<Textarea {value} name={key} id={key} placeholder="Tu wpisz opis produktu..." />
				{:else if keyType === 'categories'}
					<SelectCategories bind:combobox={categoryCombobox} bind:subcategoryCombobox />
				{:else if keyType === 'producent'}
					<SelectProducent bind:combobox={producentCombobox} />
				{/if}

				<div class="flex justify-end">
					<Form.Button class="w-20" disabled={submitting}>
						{#if delayed}
							<Spinner />
						{:else}
							Zapisz
						{/if}
					</Form.Button>
				</div>
			</div> -->
</Dialog.Root>
