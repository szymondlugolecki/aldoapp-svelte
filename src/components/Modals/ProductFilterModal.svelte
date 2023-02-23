<script lang="ts">
	import { Modal } from 'flowbite-svelte';
	import type { ProductFilter } from '$types';

	export let filterProductModalOpen: boolean;
	export let filter: ProductFilter;
	export let productAuthors: {
		id: string;
		email: string;
		fullName: string;
	}[];
</script>

<!-- New Product Modal -->
<Modal bind:open={filterProductModalOpen} size="xs" autoclose={false} class="w-full">
	<div class="flex flex-col space-y-6">
		<h3 class="text-xl font-medium 1text-gray-900 dark:text-white p-0">Filtrowanie</h3>
		<div class="space-y-2">
			<span class="block">Dodany przez</span>
			<div class="select-none">
				{#each productAuthors as author}
					<span class="block">{author.fullName}</span>
				{/each}
				<!-- <span>Wybór autorów tutaj...</span> -->
			</div>
		</div>
		<div>
			<span class="block text-sm font-medium text-gray-900 dark:text-white">Dodany</span>

			<div class="flex space-x-4">
				<div>
					<label for="joined-date-from" class="block text-sm text-gray-900 dark:text-white"
						>Od</label
					>
					<input type="date" name="joined-date-from" bind:value={filter.since} />
				</div>

				<div>
					<label for="joined-date-to" class="block text-sm text-gray-900 dark:text-white">Do</label>
					<input type="date" name="joined-date-to" bind:value={filter.until} />
				</div>
			</div>
		</div>
	</div>
</Modal>
