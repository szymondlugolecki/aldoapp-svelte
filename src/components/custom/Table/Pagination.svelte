<script lang="ts">
	import { cn } from '$lib/client/functions';

	export let totalRows: number;
	export let rowsPerPage: number;
	export let currentPage: number;

	export let setPage: (page: number) => void;

	$: pagesCount = Math.ceil(totalRows / rowsPerPage);

	$: canGoNext = currentPage < pagesCount;
	$: canGoBack = currentPage > 1;
</script>

<div class="flex justify-between items-center">
	{#if pagesCount > 1}
		<div class="flex items-center space-x-3">
			{#if pagesCount <= 4}
				{#each { length: pagesCount } as _, i}
					{#if currentPage <= pagesCount}
						<button
							on:click={() => setPage(i)}
							class={cn(
								'px-2 py-1 rounded-md',
								currentPage === i + 1 && 'bg-primary text-background'
							)}
						>
							{i + 1}
						</button>
					{/if}
				{/each}
			{:else}
				{#each { length: pagesCount } as _, i}
					{#if i === currentPage - 2 || i === currentPage - 1 || i === currentPage || i === 0 || i === pagesCount - 1}
						<button
							on:click={() => setPage(i)}
							class={cn(
								'px-2 py-1 rounded-md',
								currentPage === i + 1 && 'bg-primary text-background'
							)}
						>
							{i + 1}
						</button>
					{/if}
				{/each}
			{/if}
		</div>
		<div class="space-x-2">
			<button
				on:click={() => setPage(currentPage - 2)}
				disabled={!canGoBack}
				class="px-2 py-1 border rounded-md select-none hidden xs:inline">Wstecz</button
			>
			<button
				on:click={() => setPage(currentPage - 2)}
				disabled={!canGoBack}
				class="px-2 py-1 border rounded-md select-none xs:hidden">{'<'}</button
			>

			<button
				on:click={() => setPage(currentPage)}
				disabled={!canGoNext}
				class="px-2 py-1 border rounded-md select-none hidden xs:inline">Następna</button
			>
			<button
				on:click={() => setPage(currentPage)}
				disabled={!canGoNext}
				class="px-2 py-1 border rounded-md select-none xs:hidden">{'>'}</button
			>
		</div>
	{/if}
</div>
