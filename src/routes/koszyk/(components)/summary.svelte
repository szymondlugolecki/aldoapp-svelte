<script lang="ts">
	import Spinner from '$components/custom/Util/Spinner.svelte';
	import { Button } from '$components/ui/button';
	import { Skeleton } from '$shadcn/skeleton';
	import { ShoppingBasket } from 'lucide-svelte';

	export let subtotal: string;
	export let isRecalculating: boolean;
	export let disableOrderButton: boolean;
	export let orderFormId: string;

	$: console.log('orderFormId', orderFormId);
</script>

<div class="flex flex-col border-y border-border">
	<h2 class="px-4 pt-4 text-xl font-semibold">Podsumowanie</h2>

	<dl class="flex flex-col p-4 text-sm gap-y-6">
		<div class="flex items-center justify-between">
			<dt class="">Suma częściowa</dt>
			{#if isRecalculating}
				<Skeleton class="w-20 h-4" />
			{:else}
				<dd class="font-medium">{subtotal} PLN</dd>
			{/if}
		</div>
		<div class="flex items-center justify-between">
			<dt>Dostawa</dt>
			{#if isRecalculating}
				<Skeleton class="w-12 h-4" />
			{:else}
				<dd class="font-medium">{(0).toFixed(2)} PLN</dd>
			{/if}
		</div>
		<div class="flex items-center justify-between">
			<dt>Rabat</dt>
			{#if isRecalculating}
				<Skeleton class="w-12 h-4" />
			{:else}
				<dd class="font-medium">{(0).toFixed(2)} PLN</dd>
			{/if}
		</div>
	</dl>

	<div class="flex items-center justify-between p-4 text-base font-semibold border-t border-border">
		<dt class="">Suma</dt>
		{#if isRecalculating}
			<Skeleton class="w-24 h-4 bg-blue-600/60" />
		{:else}
			<dd class="text-blue-600">
				{subtotal}
				PLN
			</dd>
		{/if}
	</div>

	<div class="flex items-center justify-end w-full p-6">
		<div class="">
			<Button type="submit" form={orderFormId} disabled={isRecalculating || disableOrderButton}>
				{#if disableOrderButton}
					<Spinner />
				{:else}
					Zamawiam <ShoppingBasket class="ml-1 square-5" />
				{/if}
			</Button>
		</div>
	</div>
</div>
