<script lang="ts">
	import { cn } from '$lib/client/functions';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p class={cn('mb-5 mt-[10px] leading-normal text-sm xs:text-base', className)}>
	<slot />
</p>
