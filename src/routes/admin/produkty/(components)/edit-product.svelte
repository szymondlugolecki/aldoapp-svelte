<script lang="ts">
	import { Textarea } from '$shadcn/textarea';

	import { Input } from '$shadcn/input';
	import { Label } from '$shadcn/label';

	import type { Category, ExtendedCategory, ExtendedSubcategory, Subcategory, User } from '$types';
	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import type { Product } from '$lib/server/db/schemas/products';

	import * as Form from '$shadcn/form';
	import * as Dialog from '$shadcn/dialog';

	import { fodderCategories2, fodderNames, producentsList } from '$lib/client/constants';
	import type { Image } from '$lib/server/db/schemas/images';
	import SelectProducent from '$components/meltui/Select/SelectProducent.svelte';
	import { createSlider, melt, createCombobox } from '@melt-ui/svelte';
	import { cn, getSubcategoryName } from '$lib/client/functions';
	import type { Producent } from '$lib/client/constants/dbTypes';
	import SelectCategories from '$components/meltui/Select/SelectCategories.svelte';
	import RequiredAsterisk from '$components/custom/Util/RequiredAsterisk.svelte';
	import ProductId from './product-id.svelte';
	import Feedback from '$components/custom/Form/Feedback.svelte';
	import { products$ } from '$lib/client/schemas';
	import { buttonVariants } from '$components/ui/button';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { EditProductForm } from '$lib/client/schemas/products';
	import Spinner from '$components/custom/Util/Spinner.svelte';

	type ExtendedProduct = import('../$types').PageServerData['products'];

	export let label: string;
	export let key: keyof ExtendedProduct[number];
	export let value: ExtendedProduct[number][keyof ExtendedProduct[number]];
	export let product: ExtendedProduct[number];

	export { product as item };

	export let form: SuperValidated<EditProductForm>;

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
	}

	const subcategory = product.subcategory as Subcategory | undefined;

	$: subcategoryCombobox = createCombobox<Subcategory>({
		forceVisible: true,
		defaultSelected: subcategory
			? {
					value: subcategory,
					label: getSubcategoryName(product.category, subcategory)
			  }
			: undefined
	});

	$: ({
		states: { selected: selectedSubcategoryStore }
	} = subcategoryCombobox);

	$: categoryCombobox = createCombobox<Category>({
		forceVisible: true,
		defaultSelected: product.category
			? { value: product.category, label: fodderNames[product.category] }
			: undefined,
		onSelectedChange: ({ curr, next }) => {
			if (curr?.value !== next?.value) {
				$selectedSubcategoryStore = undefined;
			}
			return next;
		}
	});

	$: producentCombobox = createCombobox<Producent>({
		forceVisible: true,
		defaultSelected: product.producent
			? { value: product.producent, label: producentsList[product.producent] }
			: undefined
	});

	let open = false;
	let files: File | undefined = undefined;

	console.log('product', product);
</script>

<Dialog.Root bind:open>
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
			<Dialog.Title>Edytuj użytkownika</Dialog.Title>
			<Dialog.Description>Po dokonaniu zmian wciśnij przycisk Zapisz</Dialog.Description>
		</Dialog.Header>
		<Form.Root
			method="POST"
			action="?/edit"
			{form}
			let:message
			let:delayed
			let:timeout
			let:submitting
			schema={products$.editForm}
			let:config
			let:errors
			class="flex flex-col gap-y-2"
			options={{
				onResult: ({ result }) => {
					console.log('result', result);
					if (result.type === 'success') {
						open = false;
					}
				},
				id: product.id.toString(),
				delayMs: 1000,
				timeoutMs: 8000,
				dataType: 'json'
			}}
			enctype="multipart/form-data"
		>
			{#if key === 'name'}
				<Form.Field {config} name={key}>
					<Form.Item>
						<Form.Label>{label}</Form.Label>
						<Form.Input required value={product.name} spellcheck="false" />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			{:else if key === 'symbol'}
				<Form.Field {config} name={key}>
					<Form.Item>
						<Form.Label>{label}</Form.Label>
						<Form.Input required value={product.symbol} spellcheck="false" />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			{:else if key === 'encodedURL'}
				<a href={product.encodedURL} class="underline">Link</a>
			{:else if key === 'description'}
				<Textarea
					value={product.description}
					name={key}
					id={key}
					placeholder="Tu wpisz opis produktu..."
				/>
			{:else if key === 'category' || key === 'subcategory'}
				<SelectCategories bind:combobox={categoryCombobox} bind:subcategoryCombobox />
			{:else if key === 'price'}
				<Form.Field {config} name={key}>
					<Form.Item>
						<Form.Label>{label}</Form.Label>
						<Form.Input
							required
							value={product.price}
							type="number"
							spellcheck="false"
							step="0.01"
						/>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			{:else if key === 'weight'}
				<Form.Field {config} name={key}>
					<Form.Item>
						<Form.Label>{label}</Form.Label>
						<Form.Input required value={product.weight} type="number" spellcheck="false" />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			{:else if key === 'producent'}
				<SelectProducent bind:combobox={producentCombobox} />
			{:else if key === 'images'}
				<Form.Field {config} name="images">
					<Form.Item>
						<Form.Label>Zdjęcie</Form.Label>
						<Form.Input type="file" accept="image/*" bind:value={files} />
						<Form.Description>Wybierz zdjęcie produktu.</Form.Description>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			{/if}

			<Form.Field {config} name="id">
				<ProductId productId={product.id} />
			</Form.Field>

			<Feedback {message} {timeout} />

			<div class="flex justify-end">
				<Form.Button class="w-20" disabled={submitting}>
					{#if delayed}
						<Spinner />
					{:else}
						Zapisz
					{/if}
				</Form.Button>
			</div>
		</Form.Root>
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
