<script lang="ts">
	import { cn } from '$lib/client/functions';
	import { melt, type createDialog } from '@melt-ui/svelte';

	let className: string | undefined | null = undefined;
	export { className as class };
	export let description: ReturnType<typeof createDialog>['elements']['description'];
</script>

<p
	use:melt={$description}
	class={cn('mb-5 mt-[10px] leading-normal text-sm xs:text-base', className)}
>
	<slot />
</p>
