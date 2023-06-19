<script lang="ts">
	import { cn } from '$lib/client/functions';

	let className: string | undefined | null = undefined;
	export { className as class };
	export let changeBgOnHover: boolean = true;

	// {
	// 	'hover:bg-muted/50': changeBgOnHover,
	// 	'data-[state=selected]:bg-muted': changeBgOnHover
	// }
</script>

<tr
	class={cn(
		'border-b transition-colors',
		className,
		changeBgOnHover ? 'hover:bg-muted/20 data-[state=selected]:bg-muted' : null
	)}
	{...$$restProps}
>
	<slot />
</tr>
