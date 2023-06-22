<script lang="ts">
	import { Input } from '$shadcn/input';
	import { Label } from '$shadcn/label';

	export let keyPublicName: string;
	export let required = true;
	export let name: string | undefined = undefined;
	export let type = 'text';
	export let value: string | undefined = undefined;
</script>

<div class="grid grid-cols-4 items-center gap-4">
	<Label for={name} class="text-right"
		>{keyPublicName}{#if required}
			<span class="text-red-500">*</span>
		{/if}</Label
	>
	<Input {value} id={name} {name} {type} class="col-span-3" />
</div>
