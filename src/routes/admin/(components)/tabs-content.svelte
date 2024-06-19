<script lang="ts">
	import { cn } from '$lib/client/functions';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<div
	class={cn(
		'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
		className
	)}
>
	<slot />
</div>
