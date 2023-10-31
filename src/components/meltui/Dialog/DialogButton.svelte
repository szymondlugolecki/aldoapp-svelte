<script lang="ts">
	import { cn } from '$lib/client/functions';

	// export let close: ReturnType<typeof createDialog>['close'];
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<button
	class={cn(
		'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/80 h-10 py-2 px-4',
		className
	)}
	type="submit"
>
	<slot />
</button>
