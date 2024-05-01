<script lang="ts">
	import * as Select from '$shadcn/select';
	import * as Form from '$shadcn/form';

	import { producentsList } from '$lib/client/constants';
	import { type Infer, type SuperForm } from 'sveltekit-superforms';
	import type { EditProductForm } from '$lib/client/schemas/products';

	export { product as item };

	export let form: SuperForm<Infer<EditProductForm>>;

	const { form: formData } = form;

	$: selectedProducent = $formData.producent
		? {
				label: producentsList[$formData.producent],
				value: $formData.producent
		  }
		: undefined;
</script>

<Form.Field {form} name="producent">
	<Form.Control let:attrs>
		<Form.Label>Producent</Form.Label>

		<Select.Root
			selected={selectedProducent}
			onSelectedChange={(v) => {
				v && ($formData.producent = v.value);
			}}
		>
			<Select.Trigger {...attrs}>
				<Select.Value placeholder="Wybierz producenta" />
			</Select.Trigger>
			<Select.Content>
				{#each Object.entries(producentsList) as [value, label]}
					<Select.Item {value} {label} />
				{/each}
			</Select.Content>
		</Select.Root>
		<input hidden bind:value={$formData.producent} name={attrs.name} />
	</Form.Control>
	<Form.Description>Ułatwia znalezienie produktu używając filtrów</Form.Description>
	<Form.FieldErrors />
</Form.Field>
