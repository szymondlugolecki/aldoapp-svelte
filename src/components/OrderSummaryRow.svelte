<script lang="ts">
	import { cn } from '$lib/client/functions';

	let className: string | null | undefined = null;
	export { className as class };
</script>

<div class={cn('flex justify-between items-center leading-normal', className)}>
	<slot />
</div>
