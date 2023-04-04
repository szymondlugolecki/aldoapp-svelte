<script lang="ts">
	import TableHeader from '$components/Table/TableHeader.svelte';

	import type { OrderWithCustomer } from '$types';
	import Table from '$components/Table/Table.svelte';
	import Drawer from '$components/AdminDrawer.svelte';
	import { drawer } from '$lib/client/stores/adminDrawer';
	import toast from 'svelte-french-toast';
	import type { PromoCodeWithUsages } from '$types/PromoCodeTypes';

	export let data;

	type DefaultPromoCodesList = typeof data.promoCodes;

	let searchInput = '';
	let streamedPromoCodes: DefaultPromoCodesList = [];

	let loadingStreamedPromoCodes = true;

	const codesParser = (promoCodes: DefaultPromoCodesList) => {
		const groupedPromoCodes = promoCodes.reduce<Record<number, PromoCodeWithUsages>>((acc, row) => {
			const { promoCode, usage } = row;

			if (!acc[promoCode.id]) {
				acc[promoCode.id] = {
					...promoCode,
					usages: []
				};
			}

			if (usage) {
				acc[promoCode.id].usages.push(usage.userId);
			}

			return acc;
		}, []);

		return Object.values(groupedPromoCodes);
	};

	data.promise.promoCodes
		.then((promoCodes) => {
			streamedPromoCodes = promoCodes;
		})
		.catch((err) => {
			console.error(err);
			toast.error('Nie udało się pobrać wszystkich zamówień');
		})
		.finally(() => {
			loadingStreamedPromoCodes = false;
		});

	$: promoCodes = codesParser([...data.promoCodes, ...streamedPromoCodes]);
	// .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

	$: console.log('promoCodes', data.promoCodes);
</script>

<svelte:head>
	<title>Zamówienia • Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Lista zamówień złożonych w Twoje ALDO."
	/>
</svelte:head>

<section class="w-full h-full p-2 space-y-3">
	<TableHeader type="promoCode" bind:searchInput />

	<Table
		type="promoCodes"
		promoCodesHeaders={[
			'code',
			'discount',
			'usages',
			'action',
			'extraInfo',
			'validSince',
			'validUntil',
			'createdAt'
		]}
		items={promoCodes}
		isLoading={loadingStreamedPromoCodes}
	/>

	<Drawer>
		{#if $drawer && $drawer.type === 'user'}
			<!-- {#if $drawer.action === 'add'}
				<NewUser />
			{:else if $drawer.action === 'edit'}
				<EditUser user={getUserFromDrawer()} />
			{:else if $drawer.action === 'filter'}
				<FilterUsers bind:filter />
			{/if} -->
		{/if}
	</Drawer>
</section>
