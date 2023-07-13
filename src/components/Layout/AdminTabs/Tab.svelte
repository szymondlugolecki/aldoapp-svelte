<script lang="ts">
	import { cn } from '$lib/client/functions';

	export let href: string;
	export let pathname: string;

	$: active = href === pathname;
</script>

<a
	{href}
	class={cn(
		'inline-flex items-center text-primaryq justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
		active && 'bg-background text-primary shadow-sm'
	)}
>
	<slot /></a
>
