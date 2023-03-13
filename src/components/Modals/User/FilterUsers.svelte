<script lang="ts">
	import { Modal, Checkbox } from 'flowbite-svelte';
	import type { UserFilter } from '$types';
	export let filter: UserFilter;
</script>

<div class="flex flex-col space-y-4">
	<h3 class="text-xl font-medium text-base-content p-0">Filtrowanie</h3>
	<div class="space-y-0.5">
		<span class="block">Rola</span>

		<div class="form-control">
			<label class="cursor-pointer label justify-start space-x-3">
				<input
					type="checkbox"
					bind:checked={filter.roles.customer}
					class="checkbox checkbox-info"
				/>
				<span class="label-text">Klient</span>
			</label>
			<label class="cursor-pointer label justify-start space-x-3">
				<input
					type="checkbox"
					bind:checked={filter.roles.moderator}
					class="checkbox checkbox-success"
				/>
				<span class="label-text">Moderator</span>
			</label>
			<label class="cursor-pointer label justify-start space-x-3">
				<input type="checkbox" bind:checked={filter.roles.admin} class="checkbox checkbox-error" />
				<span class="label-text">Admin</span>
			</label>
		</div>

		<div
			class="select-none sm:space-x-3 flex flex-col sm:flex-row sm:justify-start justify-center items-start space-y-1 sm:space-y-0"
		/>
	</div>
	<div class="space-y-0.5">
		<span class="block">Dostęp</span>

		<div class="form-control">
			<label class="cursor-pointer label justify-start space-x-3">
				<input type="checkbox" bind:checked={filter.nonblocked} class="checkbox checkbox-success" />
				<span class="label-text">Z dostępem</span>
			</label>
			<label class="cursor-pointer label justify-start space-x-3">
				<input type="checkbox" bind:checked={filter.blocked} class="checkbox checkbox-error" />
				<span class="label-text">Zablokowani</span>
			</label>
		</div>
	</div>
	<div class="space-y-0.5">
		<span class="block">Dołączył(a)</span>

		<div class="flex space-y-2 sm:space-y-0 sm:space-x-4 flex-col sm:flex-row">
			<div class="w-full">
				<label for="joined-date-from" class="block text-sm text-base-content">Od</label>
				<input
					class="w-full sm:w-auto p-2 rounded-md"
					type="date"
					name="joined-date-from"
					bind:value={filter.since}
				/>
			</div>
			<div class="w-full">
				<label for="joined-date-to" class="block text-sm text-base-content">Do</label>
				<input
					type="date"
					name="joined-date-to"
					class="w-full sm:w-auto p-2 rounded-md"
					bind:value={filter.until}
				/>
			</div>
		</div>
	</div>
</div>
