<script lang="ts">
	import type { EditProductForm } from '$lib/client/schemas/products';
	import { getForm, getFormField } from 'formsnap';
	const { form } = getForm<EditProductForm>();
	const { actions } = getFormField();

	export let productId: number;
	$form.id = productId;
</script>

<input use:actions.input id="id" type="hidden" value={productId} />
