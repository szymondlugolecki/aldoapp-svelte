<script lang="ts">
	import { createCollapsible, melt } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';
	import { ChevronsUpDown, X } from 'lucide-svelte';
	import type { SvelteComponent } from 'svelte';
	import CategoryIcon from '$components/custom/Util/CategoryIcon.svelte';
	import type { MainCategory } from '$lib/client/constants/dbTypes';

	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible();
	export let categoryVisibleName: string;
	// export let previewComponent: typeof SvelteComponent<any> | undefined = undefined;
	export let category: MainCategory;
</script>

<div use:melt={$root} class="mx-auto w-full max-w-md">
	<button
		use:melt={$trigger}
		class="h-10 py-3 px-4 text-left text-base underline-offset-4 hover:underline text-primary flex"
	>
		<CategoryIcon class="mr-2" size={24} {category} />
		{categoryVisibleName}
	</button>

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
