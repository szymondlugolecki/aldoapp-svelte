<script lang="ts">
	import { cn } from '$lib/client/functions';
	import type { createDialog } from '@melt-ui/svelte';

	export let trigger: ReturnType<typeof createDialog>['trigger'];
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<button
	{...$trigger}
	use:trigger.action
	class={cn(
		'inline-flex items-center justify-center rounded-md px-4 py-2 font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75',
		className
	)}
>
	<slot />
</button>
