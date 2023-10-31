<script lang="ts">
	import type { PaginationSettings } from '$types';
	import { createPagination, melt } from '@melt-ui/svelte';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	export let paginationSettings: PaginationSettings;

	const {
		elements: { root, pageTrigger, prevButton, nextButton },
		states: { pages, range }
	} = createPagination(paginationSettings);
</script>

<!-- {#if paginationSettings.perPage && paginationSettings.count > paginationSettings.perPage} -->
<nav class="flex flex-col items-center gap-4" aria-label="pagination" use:melt={$root}>
	<p class="text-center text-magnum-900">
		Pokazano elementy {$range.start + 1} - {$range.end}
	</p>
	<div class="flex items-center gap-2">
		<button
			class="grid h-8 items-center rounded-md px-3 text-sm shadow-sm
      hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 data-[selected]:bg-primary
      data-[selected]:text-background"
			use:melt={$prevButton}><ChevronLeft class="square-4" /></button
		>
		{#each $pages as page (page.key)}
			{#if page.type === 'ellipsis'}
				<span>...</span>
			{:else}
				<button
					class="grid h-8 items-center rounded-md px-3 text-sm shadow-sm
          hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 data-[selected]:bg-primary
        data-[selected]:text-background"
					use:melt={$pageTrigger(page)}>{page.value}</button
				>
			{/if}
		{/each}
		<button
			class="grid h-8 items-center rounded-md px-3 text-sm shadow-sm
      hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 data-[selected]:bg-primary
    data-[selected]:text-background"
			use:melt={$nextButton}><ChevronRight class="square-4" /></button
		>
	</div>
</nav>
<!-- {/if} -->
