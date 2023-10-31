<script lang="ts">
	import { order$ } from '$lib/client/schemas';
	import type { ProductQuantity } from '$lib/client/schemas/order';
	import * as Form from '$shadcn/form';
	import type { SelectOption } from '@melt-ui/svelte';
	import { get } from 'svelte/store';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let form: SuperValidated<ProductQuantity>;

	const onSelectedChange = (e: SelectOption<unknown> | undefined) => {
		console.log('selected', e);
		// const id = get(config.form.formId);
		// const formElement: HTMLFormElement | undefined = document.getElementById(id)
	};
</script>

<Form.Root
	{form}
	schema={order$.productQuantity}
	let:config
	method="POST"
	action="?/changeProductQuantity"
	class="w-2/3 space-y-6"
>
	<Form.Field {config} name="quantity">
		<Form.Item>
			<Form.Select {onSelectedChange}>
				<Form.SelectTrigger placeholder="Select a verified email to display" />
				<Form.SelectContent>
					{#each { length: 9 } as _, i}
						<Form.SelectItem value={i + 1}>{i + 1}</Form.SelectItem>
					{/each}
				</Form.SelectContent>
			</Form.Select>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</Form.Root>
