<script lang="ts">
	import { orderEventsList, orderStatusList } from '$lib/client/constants';
	import { createCombobox, melt, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { cn } from '$lib/client/functions';
	import { getNextEvents } from '$lib/client/machines/orderStatus';
	import type { OrderEvent } from '$types';
	import type { OrderStatus } from '$lib/client/constants/dbTypes';

	import type { EventForm, PaymentForm } from '$lib/client/schemas/order';

	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import type { OrderAddressForm } from '$lib/client/schemas/order';

	import * as Form from '$shadcn/form';
	import { order$ } from '$lib/client/schemas';
	import Spinner from '$components/custom/spinner.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$components/ui/input';
	import { toast } from 'svelte-sonner';
	import { Switch } from '$components/ui/switch';

	type ExtendedOrder = import('../$types').PageServerData['orders'];

	export let order: ExtendedOrder[number];

	export let superform: SuperValidated<Infer<PaymentForm>>;
	export let open: boolean;

	const form = superForm(superform, {
		validators: zodClient(order$.paymentForm),
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

	const availableEvents = getNextEvents(order.status);
</script>

<form method="POST" action="?/changePaymentStatus" use:enhance class="flex flex-col gap-y-2">
	<Form.Field {form} name="paid">
		<Form.Control let:attrs>
			<div class="flex flex-row items-center justify-between p-4 border rounded-lg">
				<Form.Label>Opłacono</Form.Label>
				<Form.Description>
					Użytkownik zostanie poinformowany o zmianie statusu zamówienia (email, PUSH)
				</Form.Description>
			</div>
			<Switch includeInput {...attrs} bind:checked={$formData.paid} />
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="id" hidden={true}>
		<Form.Control let:attrs>
			<input {...attrs} type="hidden" bind:value={order.id} />
		</Form.Control>
	</Form.Field>

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
