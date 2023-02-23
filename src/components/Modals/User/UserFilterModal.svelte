<script lang="ts">
	import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
	import type { UserFilter } from '$types';

	export let filterUserModalOpen: boolean;
	export let filter: UserFilter;
</script>

<!-- New User Modal -->
<Modal bind:open={filterUserModalOpen} size="xs" autoclose={false} class="w-full">
	<div class="flex flex-col space-y-6">
		<h3 class="text-xl font-medium 1text-gray-900 dark:text-white p-0">Filtrowanie</h3>
		<div class="space-y-2">
			<span class="block">Rola</span>
			<div
				class="select-none sm:space-x-3 flex flex-col sm:flex-row sm:justify-start justify-center items-start space-y-1 sm:space-y-0"
			>
				<Checkbox inline color="blue" bind:checked={filter.roles.customer}>Klient</Checkbox>
				<Checkbox inline color="green" bind:checked={filter.roles.moderator}>Moderator</Checkbox>
				<Checkbox inline color="red" bind:checked={filter.roles.admin}>Admin</Checkbox>
			</div>
		</div>
		<div class="space-y-2">
			<span class="block">Dostęp</span>
			<div class="select-none space-x-3">
				<Checkbox inline color="green" bind:checked={filter.nonblocked}>Z dostępem</Checkbox>
				<Checkbox inline color="red" bind:checked={filter.blocked}>Zablokowani</Checkbox>
			</div>
		</div>
		<div>
			<span class="block text-sm font-medium text-gray-900 dark:text-white">Dołączył</span>

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
</Modal>
