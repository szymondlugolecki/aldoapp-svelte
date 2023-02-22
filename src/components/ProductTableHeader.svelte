<script lang="ts">
	import type { ProductFilter } from '$types';
	import { Plus, Filter, ChevronDown } from 'lucide-svelte';
	export let searchInput: string = '';
	export let newProductModalOpen: boolean;
	export let filterProductModalOpen: boolean;
</script>

<div class="relative bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
	<div
		class="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4"
	>
		<div class="w-full">
			<form class="flex items-center">
				<label for="simple-search" class="sr-only">Search</label>
				<div class="relative w-full">
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<svg
							aria-hidden="true"
							class="w-5 h-5 text-gray-500 dark:text-gray-400"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<input
						type="text"
						id="simple-search"
						class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						placeholder="Szukaj..."
						required
						bind:value={searchInput}
					/>
				</div>
			</form>
		</div>
		<div
			class="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-4"
		>
			<button
				type="button"
				class="flex items-center justify-center px-4 py-2 text-sm text-white font-medium rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
				on:click={() => (newProductModalOpen = true)}
			>
				<Plus class="mr-1" />
				Nowy produkt
			</button>
			<div class="flex items-center w-full md:w-auto relative">
				<button
					id="filterDropdownButton"
					class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
					type="button"
					on:click={() => (filterProductModalOpen = true)}
				>
					<Filter class="mr-2 w-4 h-4" />
					Filtrowanie
				</button>
			</div>
		</div>
	</div>
</div>
