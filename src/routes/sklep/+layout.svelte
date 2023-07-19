<script lang="ts">
	import { goto } from '$app/navigation';
	import { fodderCategories2, fodderNames, producentsList } from '$lib/client/constants';
	// import { isProperCategory } from '$lib/client/functions';
	import { selectedCategories } from '$lib/client/stores/shopCategories';
	import type { Category, StoreProduct, Subcategory } from '$types';
	import { Beef, ChevronUp, CornerUpLeft, X } from 'lucide-svelte';
	import { Input } from '$shadcn/input';
	import { Menu } from 'lucide-svelte';
	import { Button } from '$shadcn/button';
	import Collapsible from '$meltui/CategoryCollapsible.svelte';
	import { page } from '$app/stores';
	import CategoryIcon from '$components/CategoryIcon.svelte';

	// the reason why main is both Category and string is because
	// types seem to not work in the markup 🤔
	// let selectedCategories: CategoryChoice = {
	// 	main: null,
	// 	sub: null
	// };

	const fodderEntries = Object.entries(fodderCategories2) as unknown as [
		Category,
		Record<Subcategory, string>
	][];
</script>

<div class="w-full flex justify-center pt-3">
	<div class="flex w-full px-2 md:px-0 md:max-w-[1520px]">
		<div class="border-r border-border h-full hidden md:flex md:w-80 flex-col p-1">
			<h2 class="scroll-m-20 text-lg font-semibold tracking-tight">Kategorie</h2>

			<button
				on:click={() => goto(`/sklep`)}
				class="h-10 py-3 px-4 text-left text-base underline-offset-4 hover:underline text-primary flex"
			>
				Zobacz wszystko
			</button>

			{#each fodderEntries as [category, subcategoriesSet]}
				{#if category === 'backyard'}
					<button
						on:click={() => {
							const url = new URLSearchParams($page.url.searchParams);
							url.set('kategoria', category);
							url.delete('podkategoria');
							console.log('url', url, url.toString());
							goto(`/sklep?${url.toString()}`);
						}}
						class="h-10 py-3 px-4 text-left text-base underline-offset-4 hover:underline text-primary flex"
					>
						<CategoryIcon class="mr-2" size={24} category="backyard" />
						Hodowla przydomowa
					</button>
				{:else}
					<Collapsible categoryVisibleName={fodderNames[category]} {category}>
						<div class="flex flex-col gap-0.5 mt-2 indent-1">
							{#each Object.entries(subcategoriesSet) as subcategories}
								<button
									on:click={() => {
										const url = new URLSearchParams($page.url.searchParams);
										url.set('podkategoria', subcategories[0]);
										url.delete('kategoria');
										console.log('url', url, url.toString());
										goto(`/sklep?${url.toString()}`);
									}}
									class="py-1 px-4 text-left text-sm underline-offset-4 hover:underline text-primary"
									>{subcategories[1]}</button
								>
							{/each}
						</div>
					</Collapsible>
				{/if}
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
