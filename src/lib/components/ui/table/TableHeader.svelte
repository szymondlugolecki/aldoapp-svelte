<script lang="ts">
	import { cn } from '$lib/client/functions';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<thead class={cn('[&_tr]:border-b', className)} {...$$restProps}>
	<slot />
</thead>
