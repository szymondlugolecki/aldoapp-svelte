<script lang="ts">
	import type { User } from '@prisma/client';

	type ProductAuthor = {
		id: string;
		email: string;
		fullName: string;
	};

	type ProductFilter = {
		excludedUserIds: User['id'][];
		since: string | null;
		until: string | null;
	};

	const productAuthors: ProductAuthor[] = [
		{
			email: 'foo.bar@gmail.com',
			fullName: 'Foo Bar',
			id: '0a89c4dc-222d-4454-aaee-cc8bd90947a1'
		},
		{
			email: 'john.smith@gmail.com',
			fullName: 'John Smith',
			id: 'cabce9f4-6280-42d8-836b-7818dcbc98d1'
		}
	];

	let filter: ProductFilter = {
		excludedUserIds: [],
		since: null,
		until: new Date(new Date().setHours(23, 59, 59, 999))
			.toLocaleDateString()
			.split('.')
			.reverse()
			.join('-')
	};

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

	$: {
		console.log('selectedAuthorIds', selectedAuthorIds);
	}
</script>

<div class="flex flex-col space-y-6">
	<h3 class="text-xl font-medium 1text-gray-900 dark:text-white p-0">Filtrowanie</h3>
	<div class="space-y-2">
		<span class="block">Dodany przez</span>
		<div id="dropdownSearch" class="z-10 bg-white rounded-lg shadow dark:bg-gray-700 w-full">
			<div class="flex space-x-4">
				<button class="hover:text-blue-400 duration-100 text-sm" on:click={() => selectAll()}
					>Select all</button
				>
				<button class="hover:text-blue-400 duration-100 text-sm" on:click={() => deselectAll()}
					>Deselect all</button
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
						<div class="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
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
				<label for="joined-date-from" class="block text-sm text-gray-900 dark:text-white">Od</label>
				<input
					class="w-full sm:w-auto"
					type="date"
					name="joined-date-from"
					bind:value={filter.since}
				/>
			</div>

			<div class="w-full">
				<label for="joined-date-to" class="block text-sm text-gray-900 dark:text-white">Do</label>
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

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css" />
</svelte:head>
