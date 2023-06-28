<script lang="ts">
	import { cn } from '$lib/client/functions';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<h2 class={cn('m-0 text-lg font-medium', className)}>
	<slot />
</h2>
