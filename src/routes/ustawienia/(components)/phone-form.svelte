<script lang="ts">
	import MessageAlert from '$components/custom/Form/MessageAlert.svelte';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	import * as Form from '$components/ui/form';
	import { settings$ } from '$lib/client/schemas';
	import type { PhoneForm } from '$lib/client/schemas/settings';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let form: SuperValidated<PhoneForm>;
</script>

<Form.Root
	method="POST"
	{form}
	let:submitting
	schema={settings$.phoneForm}
	let:config
	action="?/phone"
	class="flex flex-col items-end w-full gap-y-4"
>
	<div class="flex flex-col w-full gap-y-2">
		<h2 class="text-lg font-medium">Numer telefonu</h2>

		<!-- <MessageAlert /> -->

		<div class="grid grid-cols-4 gap-x-4 gap-y-2">
			<Form.Field {form} name="phone">
				<Form.Item class="col-span-4 sm:col-span-2">
					<Form.Label>Numer telefonu</Form.Label>
					<Form.Input spellcheck="false" required type="tel" minlength={9} disabled={submitting} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
		</div>
	</div>
	{#if submitting}
		<Spinner />
	{:else}
		<Form.Button disabled={submitting}>Zapisz</Form.Button>
	{/if}
</Form.Root>
