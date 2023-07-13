<script lang="ts">
	import toast from 'svelte-french-toast';
	import type { PromoCodeWithUses } from '$types/PromoCodeTypes';

	import { roleNames } from '$lib/client/constants/index.js';
	import type { userRoles, UserRole, discountTypes } from '$lib/client/constants/dbTypes.js';

	import { page } from '$app/stores';
	import { dateParser, getRoleRank } from '$lib/client/functions/index.js';

	export let data;

	type PromoCode = (typeof data.promoCodes)[number];

	// const codesParser = (promoCodes: DefaultPromoCodesList) => {
	// 	const groupedPromoCodes = promoCodes.reduce<Record<number, PromoCodeWithUses>>((acc, row) => {
	// 		const { promoCode, usage, author } = row;

	// 		if (!author) return acc;

	// 		if (!acc[promoCode.id]) {
	// 			acc[promoCode.id] = {
	// 				...promoCode,
	// 				author: author,
	// 				uses: []
	// 			};
	// 		}

	// 		if (author) {
	// 			acc[promoCode.id].author = author;
	// 		}

	// 		if (usage) {
	// 			acc[promoCode.id].uses.push(usage.userId);
	// 		}

	// 		return acc;
	// 	}, []);

	// 	return Object.values(groupedPromoCodes);
	// };

	// id, kod, rabat, użyty, dodatkowe informacje, okres aktywności, utworzony
</script>

<svelte:head>
	<title>Zamówienia • Panel Administracyjny</title>
	<meta
		name="description"
		content="Panel Administracyjny. Lista zamówień złożonych w Twoje ALDO."
	/>
</svelte:head>

<section class="w-full h-full p-2 space-y-3" />
