<script lang="ts">
	import { createCollapsible } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';
	import { ChevronsUpDown, X } from 'lucide-svelte';
	import type { SvelteComponent } from 'svelte';
	import CategoryIcon from '$components/CategoryIcon.svelte';
	import type { MainCategory } from '$lib/client/constants/dbTypes';

	const { open, root, content, trigger } = createCollapsible();

	export let categoryVisibleName: string;
	export let previewComponent: typeof SvelteComponent | undefined = undefined;
	export let category: MainCategory;
</script>

<div {...$root} class="mx-auto w-full max-w-md">
	<button
		{...$trigger}
		use:trigger
		class="h-10 py-3 px-4 text-left text-base underline-offset-4 hover:underline text-primary flex"
	>
		<CategoryIcon class="mr-2" size={24} {category} />
		{categoryVisibleName}
	</button>

	<!-- <div class="flex items-center justify-between">
		<span class="text-sm leading-6 text-white"> {triggerButtonText} </span>
		<button
			{...$trigger}
			use:trigger
			class="relative h-6 w-6 place-items-center rounded-full bg-white text-sm text-magnum-700
        shadow-lg hover:opacity-75
        data-[disabled]:cursor-not-allowed data-[disabled]:opacity-75"
		>
			<div class="abs-center">
				{#if $open}
					<X />
				{:else}
					<ChevronsUpDown />
				{/if}
			</div>
		</button>
	</div> -->

	<svelte:component this={previewComponent} />
	<!-- <div class="my-2 rounded bg-white p-3 shadow-lg">
		<span class="text-base leading-[25px] text-magnum-800">melt-ui/melt-ui</span>
	</div> -->

	{#if $open}
		<div {...$content} class="mb-3" transition:slide>
			<slot />
		</div>
	{/if}
</div>

<style lang="postcss">
	.abs-center {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
