<script lang="ts">
	import { goto } from '$app/navigation';
	import { fodderCategories, fodderNames, producentsList } from '$lib/client/constants';
	import { isProperCategory } from '$lib/client/functions';
	import { selectedCategories } from '$lib/client/stores/shopCategories';
	import type { Category, StoreProduct, Subcategory } from '$types';
	import { ChevronUp, CornerUpLeft, X } from 'lucide-svelte';

	// the reason why main is both Category and string is because
	// types seem to not work in the markup 🤔
	// let selectedCategories: CategoryChoice = {
	// 	main: null,
	// 	sub: null
	// };

	// export let data;

	// $: console.log(data.products.map((product) => product.images));

	let productsFilterDrawer: HTMLInputElement;
</script>

<div class="w-full flex flex-col">
	<div class="drawer drawer-mobile flex-1">
		<input
			id="categories-drawer"
			type="checkbox"
			class="drawer-toggle"
			bind:this={productsFilterDrawer}
		/>
		<div class="drawer-content">
			<!-- Page content here -->
			<div class="w-full h-full sm:px-4">
				<slot />
			</div>
		</div>
		<div class="drawer-side h-full bg-opacity-95 w-72 ss:w-80 md:w-64">
			<label for="categories-drawer" class="drawer-overlay" />
			<div class="flex flex-col px-2 py-1 sticky top-0">
				<div class="flex justify-between items-center">
					<h2 class=" text-xl font-medium p-0 text-base-content">Kategorie</h2>
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<label
						tabindex="0"
						for="categories-drawer"
						class="btn btn-ghost btn-sm rounded-full px-1 flex md:hidden"
						on:keypress={function (event) {
							if (event.key === 'Enter') {
								event.currentTarget.click();
							}
						}}><X /></label
					>
				</div>

				<ul class="flex flex-col items-start py-1.5 pl-1">
					<button
						tabindex="0"
						class="btn btn-ghost hover:text-primary py-2 w-full text-left justify-start px-0 text-base {$selectedCategories &&
							$selectedCategories.main === null &&
							'text-primary'}"
						on:click={() => {
							productsFilterDrawer.click();
							$selectedCategories = {
								main: null,
								sub: null
							};
						}}>✨ Wszystko</button
					>
					{#each Object.entries(fodderCategories) as [category, subcategories]}
						<li class="w-full">
							{#if isProperCategory(category)}
								{#if subcategories.length === 0}
									<button
										tabindex="0"
										class="btn btn-ghost text-base hover:text-primary py-2 w-full text-left justify-start px-0 {$selectedCategories &&
										$selectedCategories.main === category
											? 'text-primary'
											: ''}"
										on:click={() => {
											productsFilterDrawer.click();
											$selectedCategories = {
												main: category,
												sub: null
											};
											goto('/sklep');
										}}>{fodderNames[category]}</button
									>
								{:else}
									<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
									<div tabindex="0" class="collapse py-2 group/subcategories">
										<input type="checkbox" class="appearance-none opacity-0 min-h-fit" />
										<div
											class="btn btn-ghost text-left font-semibold justify-start px-0 collapse-title hover:text-primary text-base p-0 h-8 min-h-fit "
										>
											{fodderNames[category]}
											<ChevronUp class="ml-2 group-checked/subcategories:first:rotate-180" />
										</div>
										<div class="collapse-content flex flex-col items-start space-y-0.5">
											{#each subcategories as subcategory}
												<button
													tabindex="0"
													class="btn btn-ghost h-fit p-1 hover:text-primary text-sm text-left w-full justify-start {$selectedCategories &&
													$selectedCategories.sub &&
													$selectedCategories &&
													$selectedCategories.sub === subcategory.id
														? 'text-primary'
														: ''}"
													on:click={() => {
														productsFilterDrawer.click();
														$selectedCategories = {
															main: category,
															sub: subcategory.id
														};
														// goto('/sklep/' + encodeURIComponent(subcategory.name));
														goto('/sklep');
													}}>• {subcategory.name}</button
												>
											{/each}
										</div>
									</div>
								{/if}
							{/if}
						</li>
					{/each}
				</ul>

				<div class="w-full px-2">
					<label for="categories-drawer" class="btn btn-secondary bg-opacity-95 flex md:hidden">
						<CornerUpLeft class="mr-1" /> Powrót</label
					>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.drawer {
		height: 100%;
		overflow: visible;
		max-height: none;
	}

	.drawer-toggle ~ .drawer-content {
		overflow: visible;
	}

	.drawer-toggle ~ .drawer-side {
		max-height: none;
		overflow: visible;
	}

	.drawer-toggle:checked ~ .drawer-content {
		--tw-translate-x: 0.25rem /* 8px */;
	}

	@media (min-width: 768px) {
		.drawer-mobile > .drawer-toggle ~ .drawer-side > .drawer-overlay + * {
			--tw-translate-x: 0px;
			transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
				skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
				scaleY(var(--tw-scale-y));
		}

		.drawer-mobile > .drawer-toggle ~ .drawer-side > .drawer-overlay {
			visibility: visible;
		}

		.drawer-mobile {
			grid-auto-columns: max-content auto;
		}

		.drawer-mobile > .drawer-toggle ~ .drawer-content {
			grid-column-start: 2;
		}
	}
</style>
