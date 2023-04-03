<script lang="ts">
	import type { OrderRowType, FullOrder } from '$types';
	import { orderStatusList } from '$lib/client/constants';
	import { drawer } from '$lib/client/stores/adminDrawer';

	export let order: FullOrder;
	export let rowType: OrderRowType;
</script>

{#if rowType === 'products'}
	{#each order.products as product}
		<span>• {product.quantity}x{product}</span>
	{/each}
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
	<div
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
	</div>
{/if}
