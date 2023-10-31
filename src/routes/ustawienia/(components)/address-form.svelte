<script lang="ts">
	import MessageAlert from '$components/custom/Form/MessageAlert.svelte';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	import * as Form from '$components/ui/form';
	import { settings$ } from '$lib/client/schemas';
	import type { AddressForm } from '$lib/client/schemas/settings';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let form: SuperValidated<AddressForm>;
</script>

<Form.Root
	method="POST"
	{form}
	let:submitting
	schema={settings$.addressForm}
	let:config
	action="?/address"
	class="flex flex-col items-end w-full gap-y-4"
>
	<div class="flex flex-col w-full gap-y-2">
		<h2 class="text-lg font-medium">Adres dostawy</h2>

		<MessageAlert />

		<div class="grid grid-cols-4 gap-x-4 gap-y-2">
			<Form.Field {config} name="city">
				<Form.Item class="col-span-4 sm:col-span-2">
					<Form.Label>Miasto</Form.Label>
					<Form.Input spellcheck="false" required minlength={3} disabled={submitting} />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="zipCode">
				<Form.Item class="col-span-4 sm:col-span-2">
					<Form.Label>Kod pocztowy</Form.Label>
					<Form.Input spellcheck="false" required minlength={5} disabled={submitting} />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="street">
				<Form.Item class="col-span-4">
					<Form.Label>Ulica i numer</Form.Label>
					<Form.Input spellcheck="false" required minlength={3} disabled={submitting} />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		</div>
	</div>
	{#if submitting}
		<Spinner />
	{:else}
		<Form.Button disabled={submitting}>Zapisz</Form.Button>
	{/if}
</Form.Root>
