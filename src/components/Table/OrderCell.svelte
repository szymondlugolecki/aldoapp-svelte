<script lang="ts">
	import type { OrderRowType, OrderWithCustomer } from '$types';
	import { orderStatusList } from '$lib/client/constants';
	import { drawer } from '$lib/client/stores/adminDrawer';
	import CellToolTip from '$components/CellToolTip.svelte';
	import { dateParser } from '$lib/client/functions';

	export let order: OrderWithCustomer;
	export let rowType: OrderRowType;
</script>

{#if rowType === 'products'}
	<ul>
		{#each order.products as product}
			<li>{product.quantity}x{product.productId}</li>
		{/each}
	</ul>
{:else if rowType === 'customer'}
	{#if order.customer}
		<div class="flex flex-col">
			<span>{order.customer.fullName}</span>
			<span>{order.customer.email}</span>
		</div>
	{:else}
		<div class="flex flex-col">
			<span>{order.attachedCustomer.fullName}</span>
			<span>{order.attachedCustomer.email}</span>
		</div>
	{/if}
{:else if rowType === 'status'}
	<div class="flex flex-col">
		{#if order.status === 'refunded'}
			<span class="font-semibold">🔵 {orderStatusList[order.status]}</span>
		{:else if order.status === 'canceled'}
			<span class="font-semibold">🔴 {orderStatusList[order.status]}</span>
		{:else if order.status === 'completed'}
			<span class="font-semibold">🟢 {orderStatusList[order.status]}</span>
		{:else}
			<span class="font-semibold">🟡 {orderStatusList[order.status]}</span>
		{/if}
		<span>Płatność: {orderStatusList[order.paymentStatus]}</span>
		<span>Dostawa: {orderStatusList[order.deliveryStatus]}</span>
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
					id: order.id,
					action: 'edit',
					type: 'order'
				});
			}
		}}
		on:click={() =>
			drawer.set({
				open: true,
				id: order.id,
				action: 'edit',
				type: 'order'
			})}
	>
		Edytuj
	</label>
{:else if rowType === 'createdAt'}
	<CellToolTip
		textData={dateParser(order.createdAt, 'short')}
		tooltipData={dateParser(order.createdAt, 'medium')}
	/>
	<!-- <div
		class="tooltip"
		data-tip={order.createdAt.toLocaleDateString('pl-PL', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		})}
	>
		<span
			>{order.createdAt.toLocaleDateString('pl-PL', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			})}</span
		>
	</div> -->
{/if}
