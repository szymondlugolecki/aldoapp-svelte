<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { DiscountType } from '$lib/client/constants/dbTypes';
	import createLoadingToast from '$lib/client/functions/createLoadingToast';
	import { handleFormResponse } from '$lib/client/functions/forms';
	import { drawer } from '$lib/client/stores/adminDrawer';
	import { X } from 'lucide-svelte';
	import ModalHeader from '../ModalHeader.svelte';

	let discountType: DiscountType;
</script>

<form
	class="flex flex-col space-y-4"
	method="post"
	action="?/add"
	on:submit={() => {
		drawer.update((value) => {
			if (!value) return undefined;
			return {
				...value,
				open: false
			};
		});
	}}
	use:enhance={() => {
		const toastId = createLoadingToast('please-wait');
		return async ({ result, update }) => {
			handleFormResponse(result, toastId);
			drawer.set(undefined);
			update();
		};
	}}
>
	<ModalHeader title="Dodaj nowy kod rabatowy" />

	<div class="flex space-x-4">
		<div class="flex-1">
			<label for="code" class="label label-text"> Kod rabatowy* </label>
			<input
				type="text"
				name="code"
				placeholder="np. aldo2023"
				class="input input-bordered w-full text-base-content"
				required
			/>
		</div>
		<div class="form-control max-w-[160px]">
			<label for="" class="label">
				<span class="label-text">Min. wartość koszyka*</span>
			</label>
			<input
				required
				name=""
				type="number"
				placeholder="np. 200"
				class="input input-bordered"
				max="999999"
				min="0"
			/>
		</div>
	</div>

	<div class="flex space-x-4">
		<div class="form-control flex-1">
			<label class="label" for="">
				<span class="label-text">Przecena*</span>
			</label>
			<label class="input-group">
				<input
					required
					name="discount"
					type="number"
					placeholder="np. 15"
					class="input input-bordered"
				/>
				<span>{discountType === 'percentage' ? '%' : 'PLN'}</span>
			</label>
		</div>
		<div class="">
			<label for="name" class="label label-text"> Rodzaj przeceny* </label>
			<select
				required
				id="discount-type-selection"
				name="discount-type"
				class="select select-bordered w-full"
				bind:value={discountType}
			>
				<option selected value="percentage">Procent</option>
				<option value="fixed">Stała wartość</option>
			</select>
		</div>
	</div>
	<div class="flex flex-col">
		<h3>Maksymalna ilość użyć</h3>
		<div class="flex space-x-4">
			<div class="form-control w-full">
				<label for="perUserLimit" class="label">
					<span class="label-text">Dla jednego klienta*</span>
				</label>
				<input
					required
					name="perUserLimit"
					type="number"
					placeholder="np. 1 (jednorazowy kod)"
					class="input input-bordered w-full max-w-xs"
					max="999999"
					min="1"
				/>
			</div>
			<div class="form-control w-full">
				<label for="totalUseLimit" class="label">
					<span class="label-text">Całkowita*</span>
				</label>
				<input
					required
					name="totalUseLimit"
					type="number"
					placeholder="np. 10 (pierwsze 10 osób)"
					class="input input-bordered w-full max-w-xs"
					max="999999"
					min="1"
				/>
			</div>
		</div>
	</div>
	<div>
		<div class="flex space-y-2 sm:space-y-0 sm:space-x-4 flex-col sm:flex-row">
			<div class="w-full">
				<label for="validSince" class="block text-sm text-base-content">Od</label>
				<input
					required
					type="datetime-local"
					class="w-full sm:w-auto p-2 rounded-md"
					name="validSince"
				/>
			</div>
			<div class="w-full">
				<label for="validUntil" class="block text-sm text-base-content">Do</label>
				<input
					required
					type="datetime-local"
					name="validUntil"
					class="w-full sm:w-auto p-2 rounded-md"
				/>
			</div>
		</div>
	</div>
	<div>
		<button type="submit" class="btn btn-primary w-full">Dodaj</button>
	</div>
</form>
