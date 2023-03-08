<script lang="ts">
	// let selectAllStatus: 'all' | 'none' | null = 'all';

	// const handleAllUsersSelection = (select: boolean) => {
	// 	if (select) selectAllStatus = 'all';
	// 	else selectAllStatus = 'none';
	// };

	// $: {
	// 	if (selectAllStatus === 'all') {
	// 		productAuthors.forEach(({ id }) => (selectedAuthorIds[id] = true));
	// 		selectedAuthorIds = selectedAuthorIds;
	// 	} else if (selectAllStatus === 'none') {
	// 		productAuthors.forEach(({ id }) => (selectedAuthorIds[id] = false));
	// 		selectedAuthorIds = selectedAuthorIds;
	// 	}
	// }

	import type { ProductAuthor, ProductFilter } from '$types';
	import { userFilterSearchInputFilter } from '$lib/client/functions';
	import Modal from '$components/Reusable/Modal.svelte';
	// import { Modal } from 'flowbite-svelte';

	export let filterProductModalOpen: boolean;
	export let filter: ProductFilter;
	export let productAuthors: ProductAuthor[];
	export let authorFilterSearchInput: string;
	// export let selectedAuthorIds: Record<ProductAuthor['id'], boolean>;
	// export let selectAll: () => void;
	// export let deselectAll: () => void;

	const selectedAuthorIds: Record<ProductAuthor['id'], boolean> = Object.fromEntries(
		productAuthors.map(({ id }) => {
			return [id, true];
		})
	);

	const selectAll = () =>
		productAuthors.forEach(({ id }) => {
			selectedAuthorIds[id] = true;
		});

	const deselectAll = () =>
		productAuthors.forEach(({ id }) => {
			selectedAuthorIds[id] = false;
		});

	$: filter.excludedUserIds = Object.entries(selectedAuthorIds)
		.filter(([userId, selected]) => selected === false && userId)
		.map(([userId]) => userId);

	$: filteredProductAuthors = productAuthors.filter((author) =>
		userFilterSearchInputFilter(author, authorFilterSearchInput)
	);
	// Object.entries(selectedAuthorIds)
	// 	.filter(([userId, selected]) => selected === true && userId)
	// 	.map(([userId]) => productAuthors.find((productAuthor) => productAuthor.id === userId))
	// 	.filter(Boolean) as ProductAuthor[];

	$: {
		console.log('filteredProductAuthors', filteredProductAuthors);
		console.log('selectedAuthorIds', selectedAuthorIds);
		console.log('productAuthors', productAuthors);
	}
</script>

<!-- New Product Modal -->
<Modal bind:open={filterProductModalOpen} size="xs" autoclose={true} class="w-full">
	<!-- {#if filterProductModalOpen} -->
	<div class="w-full">
		<div class="flex flex-col space-y-6">
			<h3 class="text-xl font-medium 1text-gray-900 dark:text-white p-0">Filtrowanie</h3>
			<div class="space-y-2">
				<span class="block">Dodany przez</span>
				<div id="dropdownSearch" class="z-10 bg-white rounded-lg shadow dark:bg-gray-700 w-full">
					<div class="flex space-x-4">
						<button class="hover:text-blue-400 duration-100 text-sm" on:click={() => selectAll()}
							>Zaznacz wszystkich</button
						>
						<button class="hover:text-blue-400 duration-100 text-sm" on:click={() => deselectAll()}
							>Odznacz wszystkich</button
						>
					</div>
					<div class="p-3">
						<label for="input-group-search" class="sr-only">Search</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<svg
									class="w-5 h-5 text-gray-500 dark:text-gray-400"
									aria-hidden="true"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
									><path
										fill-rule="evenodd"
										d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
										clip-rule="evenodd"
									/></svg
								>
							</div>
							<input
								type="text"
								id="input-group-search"
								class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Wyszukaj użytkownika"
								bind:value={authorFilterSearchInput}
							/>
						</div>
					</div>
					<ul
						class="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
						aria-labelledby="dropdownSearchButton"
					>
						{#each productAuthors as author (author.id)}
							{console.log('checked', selectedAuthorIds[author.id])}
							<li>
								<div
									class="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
								>
									<input
										name={author.id}
										id={author.id}
										type="checkbox"
										bind:checked={selectedAuthorIds[author.id]}
										class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
									/>
									<label
										for={author.id}
										class="w-full py-2 ml-3 text-sm font-medium text-gray-900 rounded dark:text-gray-300 flex flex-col justify-center items-start"
									>
										<span>{author.fullName}</span>
										<span>{author.email}</span>
									</label>
								</div>
							</li>
						{/each}
					</ul>
				</div>
			</div>
			<div>
				<span class="block text-sm font-medium text-gray-900 dark:text-white">Okres</span>

				<div class="flex space-y-2 sm:space-y-0 sm:space-x-4 flex-col sm:flex-row">
					<div class="w-full">
						<label for="joined-date-from" class="block text-sm text-gray-900 dark:text-white"
							>Od</label
						>
						<input
							class="w-full sm:w-auto"
							type="date"
							name="joined-date-from"
							bind:value={filter.since}
						/>
					</div>

					<div class="w-full">
						<label for="joined-date-to" class="block text-sm text-gray-900 dark:text-white"
							>Do</label
						>
						<input
							type="date"
							name="joined-date-to"
							class="w-full sm:w-auto"
							bind:value={filter.until}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- {/if} -->
</Modal>
