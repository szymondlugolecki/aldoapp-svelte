<script lang="ts">
	import * as Pagination from '$shadcn/pagination';
	import type { PaginationSettings } from '$types';

	export let paginationSettings: PaginationSettings;
</script>

<Pagination.Root
	onPageChange={(number) => {
		paginationSettings.onPageChange(number - 1);
	}}
	siblingCount={paginationSettings.siblingCount}
	count={paginationSettings.count}
	perPage={paginationSettings.perPage}
	bind:page={paginationSettings.page}
	let:pages
>
	<Pagination.Content>
		<Pagination.Item>
			<Pagination.PrevButton />
		</Pagination.Item>
		{#each pages as page (page.key)}
			{#if page.type === 'ellipsis'}
				<Pagination.Item>
					<!-- <Pagination.Ellipsis /> -->
					<span>...</span>
				</Pagination.Item>
			{:else}
				<Pagination.Item isVisible={paginationSettings.page == page.value}>
					<Pagination.Link {page} isActive={paginationSettings.page == page.value}>
						{page.value}
					</Pagination.Link>
				</Pagination.Item>
			{/if}
		{/each}
		<Pagination.Item>
			<Pagination.NextButton />
		</Pagination.Item>
	</Pagination.Content>
</Pagination.Root>
