<script lang="ts">
	import CellToolTip from '$components/CellToolTip.svelte';
	import { dateParser } from '$lib/client/functions';
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
	<span>{promoCode.usages.length} {promoCode.usages.length === 1 ? 'raz' : 'razy'}</span>
{:else if rowType === 'extraInfo'}
	<div class="flex flex-col">
		<span>{promoCode.enabled ? 'Aktywowany 🟢' : 'Dezaktywowany 🔴'}</span>
		<span>Limit na klienta: {promoCode.perUserLimit}</span>
		<span>Całkowity limit: {promoCode.totalUseLimit}</span>
	</div>
{:else if rowType === 'validDateRange'}
	<div class="flex flex-col items-start">
		<CellToolTip
			textData={dateParser(promoCode.validSince, 'short')}
			tooltipData={dateParser(promoCode.validSince, 'medium')}
		/>
		<span>-</span>
		<CellToolTip
			textData={dateParser(promoCode.validUntil, 'short')}
			tooltipData={dateParser(promoCode.validUntil, 'medium')}
		/>
	</div>
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
	<div class="flex flex-col items-start">
		<CellToolTip
			position="left"
			textData={promoCode.author.fullName}
			tooltipData={promoCode.author.email}
		/>
		<CellToolTip
			position="left"
			textData={dateParser(promoCode.createdAt, 'short')}
			tooltipData={dateParser(promoCode.createdAt, 'long')}
		/>
	</div>
{/if}
