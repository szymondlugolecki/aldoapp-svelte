<script lang="ts">
	import type { EventForm } from '$lib/client/schemas/order';
	import { getForm, getFormField } from 'formsnap';
	const { form } = getForm<EventForm>();
	const { actions } = getFormField();

	export let orderId: string;
	$form.id = orderId;
</script>

<input use:actions.input id="id" type="hidden" value={orderId} />
