<script lang="ts">
	import type { EditUserForm } from '$lib/client/schemas/user';
	import { getForm, getFormField } from 'formsnap';
	const { form } = getForm<EditUserForm>();
	const { actions } = getFormField();

	export let userId: string;
	$form.id = userId.toString();
</script>

<input use:actions.input id="id" type="hidden" value={userId} />
