<script lang="ts">
	import { cn } from '$lib/client/functions';
	import { ArrowUpDown } from 'lucide-svelte';
	export let sortable: boolean;
	export let href: string | undefined = undefined;
</script>

{#if href}
	<a {href} class="flex items-center rounded-lg w-full h-full">
		<slot />
		{#if sortable}
			<ArrowUpDown class="ml-1.5" size={20} />
		{/if}
	</a>
{:else}
	<div class="flex items-center rounded-lg w-full h-full">
		<slot />
		{#if sortable}
			<ArrowUpDown class="ml-1.5" size={20} />
		{/if}
	</div>
{/if}
