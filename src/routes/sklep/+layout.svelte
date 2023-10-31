<script lang="ts">
	import { fodderNames } from '$lib/client/constants';
	import type { ExtendedCategory, ExtendedSubcategory, ExtendedProducent } from '$types';
	import { slide } from 'svelte/transition';
	import { Button, buttonVariants } from '$shadcn/button/index.js';
	import * as Sheet from '$shadcn/sheet/index.js';
	import { page } from '$app/stores';
	import { Input } from '$shadcn/input/index.js';
	import Filters from './(components)/Filters.svelte';
	import { getSubcategoryName } from '$lib/client/functions';
	import { builderActions } from 'bits-ui';
	import { CornerDownLeft } from 'lucide-svelte';

	export let data;

	$: selectedCategory = ($page.url.searchParams.get('kategoria') || 'all') as ExtendedCategory;
	$: selectedSubcategory = ($page.url.searchParams.get('podkategoria') ||
		'all') as ExtendedSubcategory;
	$: selectedProducent = ($page.url.searchParams.get('producent') || 'all') as ExtendedProducent;

	$: mainStorePage = $page.url.pathname === '/sklep';
</script>

<svelte:head>
	<title>Sklep • Twoje ALDO</title>
	<meta
		name="description"
		content="Sklep internetowy. Znajdź produkty, które Cię interesują. Zamów online."
	/>
</svelte:head>

<div class="flex justify-center w-full min-h-screen pt-24 -mt-24">
	<div class="flex w-full px-2 md:px-0 md:max-w-[1100px] 2xl:max-w-[1400px]">
		<div class="flex flex-col w-full h-full sm:px-4">
			<div class="sticky top-[96px] flex flex-col w-full bg-background z-10">
				<div class="flex justify-between w-full py-2 sm:py-4 gap-x-3">
					<Input type="text" class="max-w-xs" placeholder="Szukaj..." />
					<div>
						<Sheet.Root>
							<Sheet.Trigger asChild let:builder>
								<Button builders={[builder]} variant="outline">Kategorie</Button>
							</Sheet.Trigger>
							<Sheet.Content side="left" class="w-[320px]">
								<Sheet.Header>
									<Sheet.Title>Filtry</Sheet.Title>
									<Sheet.Description>
										Wybierz interesujące Cię kategorie lub przefiltruj produkty według wybranych
										kryteriów
									</Sheet.Description>
								</Sheet.Header>
								<Filters bind:selectedCategory bind:selectedSubcategory bind:selectedProducent />
								<Sheet.Footer>
									<Sheet.Close asChild let:builder>
										<Button builders={[builder]} href={$page.url.pathname} variant="link"
											>Reset</Button
										>

										<button
											type="submit"
											form="store-filter-form"
											use:builderActions={{ builders: [builder] }}
											class={buttonVariants({ variant: 'default' })}
										>
											Zastosuj
										</button>
									</Sheet.Close>
								</Sheet.Footer>
							</Sheet.Content>
						</Sheet.Root>
					</div>
				</div>
				<div class="px-1 py-1">
					{#if mainStorePage}
						<div class="flex flex-col items-start justify-center gap-y-2">
							<h1 class="text-2xl font-medium tracking-tight scroll-m-20 lg:text-3xl">
								{#if selectedCategory && selectedSubcategory && selectedSubcategory !== 'all'}
									{getSubcategoryName(selectedCategory, selectedSubcategory)}
								{:else if selectedCategory && selectedCategory !== 'all'}
									{fodderNames[selectedCategory]}
								{:else}
									Wszystkie produkty
								{/if}
							</h1>
							<p class="text-sm text-muted-foreground">Znaleziono {data.products.length} wyników</p>
						</div>
					{:else}
						<div class="flex items-center justify-between">
							<a href="/sklep" class="flex items-center text-sm text-blue-600 gap-x-1"
								>Powrót do sklepu <CornerDownLeft class="square-5" /></a
							>
						</div>
					{/if}
				</div>
			</div>
			<div class="px-1 py-2 mb-3">
				<slot />
			</div>
			{#if !data.products.length}
				<div class="flex flex-col items-center justify-center pb-3 mb-3" in:slide={{ axis: 'y' }}>
					<h2 class="text-2xl text-center">🤔 Brak wyników...</h2>
					<h3 class="text-lg text-center">Spróbuj wybrać inną kategorię</h3>
				</div>
			{/if}
		</div>
	</div>
</div>
