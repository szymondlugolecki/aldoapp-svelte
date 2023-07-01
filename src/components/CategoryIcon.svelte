<script lang="ts">
	import type { MainCategory } from '$lib/client/constants/dbTypes';
	import { cn } from '$lib/client/functions';
	import { Beef, Dog, Egg, PiggyBank } from 'lucide-svelte';

	export let category: MainCategory;
	export let size: number | undefined = undefined;
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

{#if category === 'pigs'}
	<PiggyBank {size} class={cn(className)} />
{:else if category === 'cattle'}
	<Beef {size} class={cn(className)} />
{:else if category === 'poultry'}
	<Egg {size} class={cn(className)} />
{:else if category === 'backyard'}
	<Dog {size} class={cn(className)} />
{/if}
