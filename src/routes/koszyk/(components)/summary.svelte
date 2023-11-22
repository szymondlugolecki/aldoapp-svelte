<script lang="ts">
	import Spinner from '$components/custom/Util/Spinner.svelte';
	import { FormButton } from '$shadcn/form';
	import { Skeleton } from '$shadcn/skeleton';

	export let subtotal: string;
	export let processing: boolean;
	export let submittingOrder: boolean;
</script>

<div class="flex flex-col border-y border-border">
	<h2 class="px-4 pt-4 text-xl font-semibold">Podsumowanie</h2>

	<dl class="flex flex-col p-4 text-sm gap-y-6">
		<div class="flex items-center justify-between">
			<dt class="">Suma częściowa</dt>
			{#if processing}
				<Skeleton class="w-20 h-4" />
			{:else}
				<dd class="font-medium">{subtotal} PLN</dd>
			{/if}
		</div>
		<div class="flex items-center justify-between">
			<dt>Dostawa</dt>
			{#if processing}
				<Skeleton class="w-12 h-4" />
			{:else}
				<dd class="font-medium">{(0).toFixed(2)} PLN</dd>
			{/if}
		</div>
		<div class="flex items-center justify-between">
			<dt>Rabat</dt>
			{#if processing}
				<Skeleton class="w-12 h-4" />
			{:else}
				<dd class="font-medium">{(0).toFixed(2)} PLN</dd>
			{/if}
		</div>
	</dl>

	<div class="flex items-center justify-between p-4 text-base font-semibold border-t border-border">
		<dt class="">Suma</dt>
		{#if processing}
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
			<FormButton disabled={processing || submittingOrder}>
				{#if submittingOrder}
					<Spinner />
				{:else}
					Zamawiam
				{/if}
			</FormButton>
		</div>
	</div>
</div>
