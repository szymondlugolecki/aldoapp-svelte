<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		fodderCategories,
		fodderCategories2,
		fodderNames,
		producentsList
	} from '$lib/client/constants';
	import { isProperCategory } from '$lib/client/functions';
	import { selectedCategories } from '$lib/client/stores/shopCategories';
	import type { Category, StoreProduct, Subcategory } from '$types';
	import { ChevronUp, CornerUpLeft, X } from 'lucide-svelte';
	import { Input } from '$shadcn/input';
	import { Menu } from 'lucide-svelte';
	import { Button } from '$shadcn/button';

	// the reason why main is both Category and string is because
	// types seem to not work in the markup 🤔
	// let selectedCategories: CategoryChoice = {
	// 	main: null,
	// 	sub: null
	// };
</script>

<div class="w-full flex justify-center pt-3">
	<div class="flex w-full px-2 md:px-0 md:max-w-[1520px]">
		<div class="border-r border-border h-full hidden md:flex md:w-80 flex-col p-1">
			<h2 class="scroll-m-20 text-lg font-semibold tracking-tight">Kategorie</h2>

			{#each Object.entries(fodderNames) as [category, categoryVisibleName]}
				<button
					class="h-10 py-2 px-4 text-left text-base underline-offset-4 hover:underline text-primary"
					>{categoryVisibleName}</button
				>
			{/each}
			<!-- <h4>Filtry</h4> -->
		</div>
		<div class="flex flex-col w-full h-full sm:px-4">
			<div class="flex justify-between w-full h-12">
				<Input class="max-w-xl" type="text" placeholder="Wyszukaj..." />
				<Button class="ml-2 md:hidden">
					<Menu class="xxs:mr-2 h-4 w-4" />
					<span class="hidden xxs:flex">Kategorie</span>
				</Button>
			</div>
			<slot />
		</div>
	</div>
</div>
