<script lang="ts">
	import * as Select from '$shadcn/select';
	import * as Form from '$shadcn/form';

	import { fodderNames } from '$lib/client/constants';
	import { getSubcategories, getSubcategoryName } from '$lib/client/functions';
	import { type Infer, type SuperForm } from 'sveltekit-superforms';
	import type { AddProductForm } from '$lib/client/schemas/products';
	import RequiredAsterisk from '$components/custom/Util/RequiredAsterisk.svelte';

	export { product as item };
	export let required: boolean | undefined = undefined;
	export let form: SuperForm<Infer<AddProductForm>>;

	const { form: formData } = form;

	$: selectedCategory = $formData.category
		? {
				label: fodderNames[$formData.category],
				value: $formData.category
		  }
		: undefined;

	$: selectedSubcategory =
		$formData.category && $formData.subcategory
			? {
					label: getSubcategoryName($formData.category, $formData.subcategory),
					value: $formData.subcategory
			  }
			: undefined;

	$: availableSubcategories = getSubcategories($formData.category);
</script>

<Form.Field {form} name="category">
	<Form.Control let:attrs>
		<Form.Label>Kategoria<RequiredAsterisk {required} /></Form.Label>

		<Select.Root
			selected={selectedCategory}
			onSelectedChange={(v) => {
				v && ($formData.category = v.value);
			}}
		>
			<Select.Trigger {...attrs}>
				<Select.Value placeholder="Wybierz kategorię" />
			</Select.Trigger>
			<Select.Content>
				{#each Object.entries(fodderNames) as [value, label]}
					<Select.Item {value} {label} />
				{/each}
			</Select.Content>
		</Select.Root>
		<input hidden bind:value={$formData.category} name={attrs.name} />
	</Form.Control>
	<Form.Description>Ułatwia znalezienie produktu używając filtrów</Form.Description>
	<Form.FieldErrors />
</Form.Field>

{#if $formData.category}
	<Form.Field {form} name="subcategory">
		<Form.Control let:attrs>
			<Form.Label>Podkategoria<RequiredAsterisk {required} /></Form.Label>

			<Select.Root
				selected={selectedSubcategory}
				onSelectedChange={(v) => {
					v && ($formData.subcategory = v.value);
				}}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Wybierz podkategorię" />
				</Select.Trigger>
				<Select.Content>
					{#each availableSubcategories as value}
						<Select.Item {value} label={getSubcategoryName($formData.category, value)} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.subcategory} name={attrs.name} />
		</Form.Control>
		<Form.Description>Ułatwia znalezienie produktu używając filtrów</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
{/if}
