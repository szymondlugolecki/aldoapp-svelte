<script lang="ts">
	import { Input } from '$shadcn/input';
	import { Label } from '$shadcn/label';

	export let label: string;
	export let required = true;
	export let name: string | undefined = undefined;
	export let type = 'text';
	export let value: string | undefined = undefined;
	export let step: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
</script>

<div class="grid w-full items-center gap-y-1.5">
	<Label for={name}
		>{label}{#if required}
			<span class="text-red-500">*</span>
		{/if}</Label
	>
	<Input
		{value}
		id={name}
		{name}
		{type}
		{step}
		{placeholder}
		class="col-span-4 h-9"
		spellcheck="false"
	/>
	<!-- <p class="text-sm text-muted-foreground">Enter your email address.</p> -->
</div>
