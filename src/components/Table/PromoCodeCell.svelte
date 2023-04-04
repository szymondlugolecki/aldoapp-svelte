<script lang="ts">
	import { orderStatusList } from '$lib/client/constants';
	import { drawer } from '$lib/client/stores/adminDrawer';
	import type { PromoCodeRowType, PromoCodeWithUsages } from '$types/PromoCodeTypes';

	export let promoCode: PromoCodeWithUsages;
	export let rowType: PromoCodeRowType;
</script>

{#if rowType === 'code'}
	<span>{promoCode.code}</span>
{:else if rowType === 'discount'}
	<span>{promoCode.discount}{promoCode.discountType === 'fixed' ? ' PLN' : '%'}</span>
{:else if rowType === 'usages'}
	<span>{promoCode.usages.length}</span>
{:else if rowType === 'extraInfo'}
	<div class="flex flex-col">
		<span>Włączony: {promoCode.enabled ? 'Tak 🟢' : 'Nie 🔴'}</span>
		<span>Limit na klienta: {promoCode.perUserLimit}</span>
		<span>Całkowity limit: {promoCode.totalUseLimit}</span>
	</div>
{:else if rowType === 'validSince'}
	<span
		>{promoCode.validSince.toLocaleDateString('pl-PL', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		})}</span
	>
{:else if rowType === 'validUntil'}
	<span
		>{promoCode.validUntil.toLocaleDateString('pl-PL', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		})}</span
	>
{:else if rowType === 'action'}
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<label
		for="admin-drawer"
		tabindex="0"
		class="btn btn-ghost btn-sm"
		on:keypress={(e) => {
			if (e.key === 'Enter') {
				drawer.set({
					open: true,
					id: promoCode.id,
					action: 'edit',
					type: 'promoCode'
				});
			}
		}}
		on:click={() =>
			drawer.set({
				open: true,
				id: promoCode.id,
				action: 'edit',
				type: 'promoCode'
			})}
	>
		Edytuj
	</label>
{:else if rowType === 'createdAt'}
	<div
		class="tooltip"
		data-tip={promoCode.createdAt.toLocaleDateString('pl-PL', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		})}
	>
		<span
			>{promoCode.createdAt.toLocaleDateString('pl-PL', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			})}</span
		>
	</div>
{/if}
