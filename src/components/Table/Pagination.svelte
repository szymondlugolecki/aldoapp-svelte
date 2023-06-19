<script lang="ts">
	import { page } from '$app/stores';

	export let totalRows: number;
	export let rowsPerPage: number;

	export let currentPage: number;

	$: pagesCount = Math.ceil(totalRows / rowsPerPage);

	$: canGoNext = currentPage < pagesCount;
	$: canGoBack = currentPage > 1;

	const linkToPage = (page: number) => {
		const url = $page.url.searchParams;
		console.log('url', url);
		url.set('strona', page.toString());
		console.log('link to page =>', `?${url.toString()}`);
		return `?${url.toString()}`;
	};
</script>

<div class="flex justify-between items-center">
	{#if pagesCount > 1}
		<div class="flex items-center space-x-3">
			{#if pagesCount <= 4}
				{#each { length: pagesCount } as _, i}
					{#if currentPage <= pagesCount}
						<a
							href={linkToPage(i + 1)}
							class={currentPage === i + 1
								? 'bg-primary text-white px-2 py-1 border rounded-md'
								: ''}
						>
							{i + 1}
						</a>
					{/if}
				{/each}
			{:else}
				{#each { length: pagesCount } as _, i}
					{#if i === currentPage - 2 || i === currentPage - 1 || i === currentPage || i === 0 || i === pagesCount - 1}
						<a
							href={linkToPage(i + 1)}
							class="px-2 py-1 border rounded-md"
							class:bg-primary={currentPage === i + 1}
						>
							{i + 1}
						</a>
					{/if}
				{/each}
			{/if}
		</div>
		<div class="space-x-2">
			{#if canGoBack}
				<a
					href="?strona={currentPage - 1}"
					class="px-2 py-1 border rounded-md select-none hidden xs:inline">Wstecz</a
				>
				<a
					href="?strona={currentPage - 1}"
					class="px-2 py-1 border rounded-md select-none xs:hidden">{'<'}</a
				>
			{:else}
				<span class="px-2 py-1 border rounded-md select-none hidden xs:inline">Wstecz</span>
				<span class="px-2 py-1 border rounded-md select-none xs:hidden">{'<'}</span>
			{/if}

			{#if canGoNext}
				<a
					href="?strona={currentPage + 1}"
					class="px-2 py-1 border rounded-md select-none hidden xs:inline">Następna</a
				>
				<a
					href="?strona={currentPage + 1}"
					class="px-2 py-1 border rounded-md select-none xs:hidden">{'>'}</a
				>
			{:else}
				<span class="px-2 py-1 border rounded-md select-none hidden xs:inline">Następna</span>
				<span class="px-2 py-1 border rounded-md select-none xs:hidden">{'>'}</span>
			{/if}
		</div>
	{/if}
</div>
