<script lang="ts">
	import { drawer } from '$lib/client/stores/adminDrawer';
	import { Plus, Filter } from 'lucide-svelte';

	let addNewItemText = '';
	$: {
		if (type === 'user') {
			addNewItemText = 'Nowy użytkownik';
		} else if (type === 'product') {
			addNewItemText = 'Nowy produkt';
		}
	}

	export let searchInput = '';
	export let type: 'user' | 'product';
</script>

<div class="relative bg-base-100 shadow-md sm:rounded-lg">
	<div
		class="flex flex-col items-center justify-between py-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4"
	>
		<div class="w-full">
			<form class="flex items-center">
				<label for="simple-search" class="sr-only">Szukaj</label>
				<div class="relative w-full">
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<svg
							aria-hidden="true"
							class="w-5 h-5 text-primary"
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
						class="block w-full p-2 pl-10 h-12 text-sm border border-base-content rounded-lg focus:ring-secondary-focus focus:border-secondary-focus bg-base-100 text-base-content"
						placeholder="Szukaj..."
						required
						bind:value={searchInput}
					/>
				</div>
			</form>
		</div>
		<div class="flex items-center space-x-2 w-full md:w-auto">
			<label
				for="admin-drawer"
				class="btn btn-primary flex-1 w-auto md:min-w-[220px] text-[0px] sm:text-sm"
				on:keypress={(e) => {
					if (e.key === 'Enter') {
						drawer.set({
							action: 'add',
							type
						});
					}
				}}
				on:click={() => {
					console.log('action: add, type: ', type);
					drawer.set({
						action: 'add',
						type
					});
				}}
			>
				<Plus class="mr-1" />
				{addNewItemText}
			</label>
			<label
				id="filterDropdownButton"
				for="admin-drawer"
				class="drawer-button btn btn-accent flex-1 w-auto md:min-w-[220px] text-[0px] sm:text-sm"
				on:keypress={(e) => {
					if (e.key === 'Enter') {
						drawer.set({
							action: 'filter',
							type
						});
					}
				}}
				on:click={() =>
					drawer.set({
						action: 'filter',
						type
					})}
				><Filter class="mr-2 w-5 h-5" />
				Filtrowanie</label
			>
		</div>
	</div>
</div>
