<script lang="ts">
	import { page } from '$app/stores';
	import { order$, user$ } from '$lib/client/schemas';
	import type { OrderForm } from '$lib/client/schemas/order';
	import * as Form from '$shadcn/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import RequiredAsterisk from '../Util/RequiredAsterisk.svelte';
	import { Label } from '$shadcn/label';
	export let form: SuperValidated<OrderForm>;
</script>

<Form.Root
	method="POST"
	{form}
	schema={order$.create}
	let:config
	action="?/createOrder"
	class="grid grid-cols-4 gap-x-4 gap-y-2"
>
	<Form.Field {form} name="city">
		<Form.Item class="col-span-4 sm:col-span-2">
			<Form.Label>Miasto<RequiredAsterisk /></Form.Label>
			<Form.Input spellcheck="false" />
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="zipCode">
		<Form.Item class="col-span-4 sm:col-span-2">
			<Form.Label>Kod pocztowy<RequiredAsterisk /></Form.Label>
			<Form.Input spellcheck="false" />
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="street">
		<Form.Item class="col-span-4">
			<Form.Label>Ulica i numer<RequiredAsterisk /></Form.Label>
			<Form.Input spellcheck="false" />
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="paymentMethod">
		<Form.Item class="flex flex-col col-span-2 gap-y-3">
			<Form.Label>Metoda płatności<RequiredAsterisk /></Form.Label>
			<Form.RadioGroup class="flex flex-col space-y-1">
				<Form.Item class="flex items-center space-x-3 space-y-0">
					<Form.RadioItem value="cash" id="cash" />
					<Label for="cash" class="font-normal">Gotówka lub przedpłata</Label>
				</Form.Control>
				<Form.Item class="flex items-center space-x-3 space-y-0">
					<Form.RadioItem value="transfer" id="transfer" />
					<Label for="transfer" class="font-normal">Przelew bankowy</Label>
				</Form.Control>
			</Form.RadioGroup>
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="paymentMethod">
		<Form.Item class="flex flex-col col-span-2 gap-y-3">
			<Form.Label>Metoda dostawy<RequiredAsterisk /></Form.Label>
			<Form.RadioGroup class="flex flex-col space-y-1" value="personal-delivery">
				<Form.Item class="flex items-center space-x-3 space-y-0">
					<Form.RadioItem value="personal-delivery" id="personal-delivery" />
					<Label for="personal-delivery" class="font-normal">Kierowca ALDO</Label>
				</Form.Control>
			</Form.RadioGroup>
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>
	<!-- <Form.Button>Złóż zamówienie</Form.Button> -->
</Form.Root>
