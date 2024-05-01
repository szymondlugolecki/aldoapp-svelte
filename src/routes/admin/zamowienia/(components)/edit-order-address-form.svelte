<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import type { OrderAddressForm } from '$lib/client/schemas/order';

	import * as Form from '$shadcn/form';
	import { order$ } from '$lib/client/schemas';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$components/ui/input';
	import { toast } from 'svelte-sonner';
	type ExtendedOrder = import('../$types').PageServerData['orders'];

	export let order: ExtendedOrder[number];

	export let superform: SuperValidated<Infer<OrderAddressForm>>;
	export let open: boolean;

	const form = superForm(superform, {
		validators: zodClient(order$.orderAddressForm),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				open = false;
				console.log(f, f.message, f.posted, f.errors);
				// toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
				toast.success(`Sukces`);
			} else {
				toast.error('Błąd');
			}
		}
	});
	const { form: formData, enhance, delayed, submitting } = form;
</script>

<!-- <Form.Root
	method="POST"
	action="?/changeOrderAddress"
	{form}
	let:message
	let:delayed
	let:timeout
	let:submitting
	schema={order$.orderAddressForm}
	let:config
	class="flex flex-col gap-y-2"
	options={{
		onResult: ({ result }) => {
			console.log('result', result);
			if (result.type === 'success') {
				open = false;
			}
		},
		id: order.id.toString(),
		delayMs: 1000,
		timeoutMs: 8000
	}}
> -->
<form method="POST" action="?/changeOrderAddress" use:enhance class="flex flex-col gap-y-2">
	<Form.Field {form} name="city">
		<Form.Control let:attrs>
			<Form.Label>Miasto</Form.Label>
			<Input {...attrs} required bind:value={$formData.city} spellcheck="false" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="zipCode">
		<Form.Control let:attrs>
			<Form.Label>Kod pocztowy</Form.Label>
			<Input {...attrs} required minlength={5} bind:value={$formData.zipCode} spellcheck="false" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="street">
		<Form.Control let:attrs>
			<Form.Label>Ulica i numer domu</Form.Label>
			<Input {...attrs} required bind:value={$formData.street} spellcheck="false" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="id" hidden={true}>
		<Form.Control let:attrs>
			<input {...attrs} type="hidden" bind:value={order.id} />
		</Form.Control>
	</Form.Field>

	<!-- <Form.Field {form} name="id">
		<OrderId orderId={order.id} />
	</Form.Field> -->

	<!-- <Feedback {message} {timeout} /> -->

	<div class="flex justify-end">
		<Form.Button class="w-20" disabled={$submitting}>
			{#if $delayed}
				<Spinner />
			{:else}
				Zapisz
			{/if}
		</Form.Button>
	</div>
</form>
<!-- </Form.Root> -->
