<script lang="ts">
	import { cn } from '$lib/client/functions';
	import type { createDialog } from '@melt-ui/svelte';

	let className: string | undefined | null = undefined;
	export { className as class };
	export let description: ReturnType<typeof createDialog>['description'];
</script>

<p {...description} class={cn('mb-5 mt-[10px] leading-normal text-sm xs:text-base', className)}>
	<slot />
</p>
