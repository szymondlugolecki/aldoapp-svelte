<script lang="ts">
	import { cn } from '$lib/client/functions';
	import type { createDialog } from '@melt-ui/svelte';

	let className: string | undefined | null = undefined;
	export { className as class };
	export let title: ReturnType<typeof createDialog>['title'];
</script>

<h2 {...title} class={cn('m-0 text-lg font-medium', className)}>
	<slot />
</h2>
