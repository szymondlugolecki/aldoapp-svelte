<script lang="ts">
	import type { SelectOption } from '@melt-ui/svelte';

	import * as Dialog from '$shadcn/dialog';
	import * as Form from '$shadcn/form';

	import { mainCategories, type MainCategory, type Producent } from '$lib/client/constants/dbTypes';
	import { buttonVariants } from '$components/ui/button';
	import { products$ } from '$lib/client/schemas';
	import type { AddProductForm } from '$lib/client/schemas/products';
	import type { SuperValidated } from 'sveltekit-superforms';
	import RequiredAsterisk from '$components/custom/Util/RequiredAsterisk.svelte';
	import { fodderNames } from '$lib/client/constants';
	import { getSubcategories, getSubcategoryName } from '$lib/client/functions';
	// import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	// export let enhance: ReturnType<typeof superForm>['enhance'];
	export let form: SuperValidated<AddProductForm>;

	let open = false;

	$: selectedCategory = undefined as MainCategory | undefined;
	$: subcategories = getSubcategories(selectedCategory);

	const onSelectedChange = (change: SelectOption<unknown> | undefined) => {
		selectedCategory = change?.value as MainCategory | undefined;
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Dodaj produkt</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Dodaj produkt</Dialog.Title>
			<Dialog.Description>Kliknij przycisk poniżej, aby zapisać zmiany</Dialog.Description>
		</Dialog.Header>

		<!-- <div class="overflow-y-auto h-52"><SuperDebug data={form} /></div> -->

		<Form.Root
			method="POST"
			action="?/add"
			{form}
			schema={products$.addForm}
			let:config
			class="flex flex-col gap-y-2"
			options={{
				onResult: ({ result }) => {
					console.log('result', result);
					if (result.type === 'success') {
						open = false;
					}
				}
			}}
		>
			<Form.Field {config} name="name">
				<Form.Item>
					<Form.Label>Nazwa<RequiredAsterisk required /></Form.Label>
					<Form.Input required spellcheck="false" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="symbol">
				<Form.Item>
					<Form.Label>Kod produktu<RequiredAsterisk required /></Form.Label>
					<Form.Input required placeholder="ABCD-1234" spellcheck="false" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="price">
				<Form.Item>
					<Form.Label>Cena<RequiredAsterisk /></Form.Label>
					<Form.Input type="number" placeholder="50" required step="0.01" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="weight">
				<Form.Item>
					<Form.Label>Waga (kg)<RequiredAsterisk /></Form.Label>
					<Form.Input type="number" placeholder="25" required />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="category">
				<Form.Item>
					<Form.Label>Kategoria<RequiredAsterisk /></Form.Label>
					<Form.Select required {onSelectedChange}>
						<Form.SelectTrigger placeholder="Wybierz kategorię" />
						<Form.SelectContent>
							{#each mainCategories as category}
								<Form.SelectItem value={category}>{fodderNames[category]}</Form.SelectItem>
							{/each}
						</Form.SelectContent>
					</Form.Select>
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			{#key selectedCategory}
				{#if selectedCategory && subcategories.length}
					<Form.Field {config} name="subcategory">
						<Form.Item>
							<Form.Label>Podkategoria<RequiredAsterisk /></Form.Label>
							<Form.Select required>
								<Form.SelectTrigger placeholder="Wybierz podkategorię" />
								<Form.SelectContent>
									{#each subcategories as subcategory}
										<Form.SelectItem value={subcategory}
											>{getSubcategoryName(selectedCategory, subcategory)}</Form.SelectItem
										>
									{/each}
								</Form.SelectContent>
							</Form.Select>
							<Form.Validation />
						</Form.Item>
					</Form.Field>
				{/if}
			{/key}

			<Form.Button>Dodaj</Form.Button>
		</Form.Root>

		<!-- <form method="post" action="?/add" use:enhance>
			<div class="flex flex-col gap-y-2">
				<DialogInput name="name" label="Nazwa" required />
				<DialogInput name="symbol" label="Kod produktu" required placeholder="0123-4567" />

				<SelectProducent bind:combobox={producentCombobox} required />
				<SelectCategories bind:combobox={categoryCombobox} bind:subcategoryCombobox required />

				<DialogInput
					name="price"
					label="Cena"
					type="number"
					step="0.01"
					required
					placeholder="50"
				/>
				<DialogInput name="weight" label="Waga (kg)" type="number" placeholder="25" required />

				<div class="flex justify-end">
					<Form.Button class="w-20">Dodaj</Form.Button>
				</div>
			</div>
		</form> -->
	</Dialog.Content>
</Dialog.Root>
