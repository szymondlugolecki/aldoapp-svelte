<script lang="ts">
	import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp, X } from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import { imagesSorting } from '$lib/client/functions/sorting';
	import {
		orderAddressValidation,
		orderDeliveryMethodValidation,
		orderPaymentMethodValidation,
		serverOrderValidation
	} from '$lib/client/schemas/order';
	import { betterZodParse } from '$lib/client/functions/betterZodParse';
	import type { CartProduct, CartLayoutData, User } from '$types';
	import type { Optional } from '$types/UtilityTypes';
	import Separator from '$shadcn/separator/Separator.svelte';
	import Button from '$shadcn/button/Button.svelte';
	import { cn, flyAndScale, isAtLeastModerator } from '$lib/client/functions/index.js';
	import { enhance } from '$app/forms';
	import createLoadingToast from '$lib/client/functions/createLoadingToast.js';
	import { handleFormResponse } from '$lib/client/functions/forms.js';
	import Address from '$components/Dialogs/Settings/Address.svelte';
	import type { Cart } from '$lib/server/db/schemas/carts.js';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { createCombobox, createDialog } from '@melt-ui/svelte';
	import { buttonVariants } from '$shadcn/button/index.js';

	export let data;

	console.log('data2', data.customers);

	const fakeCustomers = [
		{
			email: 'bogdan.paczek@gmail.com',
			fullName: 'Bogdan Pączek',
			id: 'jxbdvjjq8ebr9rvp20ezkiv9',
			phone: '111121111'
		},
		{
			email: 'twuj.stary15@gmail.com',
			fullName: 'Twuj Stary',
			id: 'jxbdvjjq8ebr9rvp20ezkiv6',
			phone: '111121113'
		}
	];

	const {
		open: comboBoxOpen,
		input,
		menu,
		item,
		inputValue,
		isSelected,
		filteredItems
	} = createCombobox({
		filterFunction: (item, inputValue) => {
			// Example string normalization function. Replace as needed.
			const normalize = (str: string) => str.normalize().toLowerCase();
			const normalizedInput = normalize(inputValue);
			return (
				normalizedInput === '' ||
				normalize(item.fullName).includes(normalizedInput) ||
				normalize(item.email).includes(normalizedInput)
			);
		},
		items: fakeCustomers,
		itemToString: (item) => item.fullName
	});

	const { trigger, portal, overlay, content, title, description, close, open } = createDialog();

	$: subtotal = data.cart
		? data.cart.products
				.map(({ quantity, price }) => [price, quantity])
				.reduce((prev, [price, quantity]) => prev + Number(price) * Number(quantity), 0)
				.toFixed(2)
		: '0.00';

	const stageNames = ['Koszyk', 'Dostawa', 'Płatność', 'Potwierdzenie'];
	const stages = ['koszyk', 'dostawa', 'platnosc', 'potwierdzenie'] as const;

	let stageIndex: number = 0;

	$: {
		const urlSplit = data.url.split('/').reverse();
		const [stage, route] = urlSplit;
		if (route === 'zamowienie') {
			if (stage === 'koszyk') {
				stageIndex = 0;
			} else if (stage === 'dostawa') {
				stageIndex = 1;
			} else if (stage === 'platnosc') {
				stageIndex = 2;
			} else if (stage === 'podsumowanie') {
				stageIndex = 3;
			}
		}
	}

	$: stage1Passed =
		$cartData.deliveryMethod &&
		($cartData.useCustomAddress
			? orderAddressValidation.safeParse($cartData.customAddress).success
			: true);

	$: stepsPassed = {
		0: !!data.cart?.products.length,
		1: stage1Passed,
		2: true,
		3: true
	} as Record<number, boolean>;

	const cartData = writable<CartLayoutData>({
		useCustomAddress: false,
		customAddress: {
			street: '',
			zipCode: '',
			city: ''
		},
		deliveryMethod: data.cart?.deliveryMethod || 'personal-delivery',
		paymentMethod: data.cart?.paymentMethod || 'cash'
	});

	setContext('cartData', cartData);

	let allowAdviserOrdering = false;
</script>

<section class="w-full flex flex-col items-center justify-center">
	{#if data.cart && data.cart.products.length}
		<ul class="steps py-2 container">
			<li data-content="🛒" class="step {stageIndex >= 0 ? 'step-primary' : 'step-neutral'}">
				{stageNames[0]}
			</li>
			<li data-content="🚗" class="step {stageIndex >= 1 ? 'step-primary' : 'step-neutral'}">
				{stageNames[1]}
			</li>
			<li data-content="💵" class="step {stageIndex >= 2 ? 'step-primary' : 'step-neutral'}">
				{stageNames[2]}
			</li>
		</ul>

		<div class="divider my-2 lg:my-4" />

		<form
			use:enhance={({ formData }) => {
				const toastId = createLoadingToast('please-wait');

				// Stage 1 - Delivery
				if (stageIndex === 1) {
					formData.append('deliveryMethod', $cartData.deliveryMethod);
					if ($cartData.useCustomAddress) {
						formData.append('customAddress', JSON.stringify($cartData.customAddress));
					}
				}

				// Stage 2 - Payment
				else if (stageIndex === 2) {
					formData.append('paymentMethod', $cartData.paymentMethod);
				}

				return async ({ result, update }) => {
					handleFormResponse(result, toastId, undefined, true);
					update();
				};
			}}
			method="post"
			class="w-full h-full flex lg:flex-row flex-col items-start justify-center lg:space-x-3"
		>
			<div
				class="text-left h-full flex flex-col p-2 space-y-6 w-full lg:max-w-[700px] xl:max-w-[900px]"
			>
				<slot />
			</div>
			<div
				class="max-h-[650px] w-full h-full flex flex-col space-y-4 p-4 rounded-md xl:max-w-[340px] lg:max-w-[270px] sm:space-y-6 lg:border border-border"
			>
				<h2 class="text-xl xl:text-2xl font-bold">Podsumowanie</h2>
				<div class="flex flex-col space-y-2 md:text-sm lg:text-base">
					<div class="flex justify-between items-center">
						<span>Suma częściowa</span>
						<bold>{subtotal} PLN</bold>
					</div>
					<div class="flex justify-between items-center">
						<span>Dostawa</span>
						<bold>{(0).toFixed(2)} PLN</bold>
					</div>
					<div class="flex justify-between items-center">
						<span>Rabat</span>
						<bold>{(0).toFixed(2)} PLN</bold>
					</div>

					<Separator class="my-1" />

					<div class="flex justify-between items-center">
						<bold class="font-bold text-base">Suma całkowita</bold>
						<bold class="font-bold text-base"
							>{subtotal}
							PLN</bold
						>
					</div>
				</div>

				<div class="space-y-2 flex flex-col">
					<div class="flex space-x-3 justify-end">
						{#if stageIndex > 0}
							<Button href="/zamowienie/{stages[stageIndex - 1]}" variant="secondary">
								<ArrowLeft class="mr-1" /> Wstecz
							</Button>
						{/if}

						{#if stageIndex === 0}
							<Button class="grow-[5]" href="/zamowienie/dostawa">
								Dostawa
								<ArrowRight class="ml-1" />
							</Button>
						{:else if stageIndex === 1}
							{#if stepsPassed[stageIndex]}
								<Button class="grow-[5]" type="submit" formaction="?/setDeliveryMethod">
									Płatność
									<ArrowRight class="ml-1" />
								</Button>
							{:else}
								<Button class="grow-[5]" disabled>
									Płatność
									<ArrowRight class="ml-1" />
								</Button>
							{/if}
						{:else if stageIndex === 2}
							<Button class="grow-[5]" formaction="?/setPaymentMethod">Podgląd</Button>
						{:else if stageIndex === 3}
							<Button variant="destructive" class="grow-[5]" formaction="?/createOrder"
								>Zamawiam</Button
							>
						{/if}
					</div>

					<!-- remove the false when ready -->
					{#if data.user && isAtLeastModerator(data.user.role) && allowAdviserOrdering}
						{#if stageIndex === 0}
							<div class="w-full">
								<button
									{...$trigger}
									use:trigger
									class={cn(
										buttonVariants({ variant: 'outline', size: 'default', className: 'w-full' })
									)}>Zamów dla klienta</button
								>

								<div use:portal>
									{#if $open}
										<div {...$overlay} class="fixed inset-0 z-40 bg-black/50" />
										<div
											class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md p-[25px] bg-background shadow-lg"
											transition:flyAndScale={{
												duration: 150,
												y: 8,
												start: 0.96
											}}
											{...$content}
											use:content
										>
											<h2 {...$title} class="m-0 text-lg font-medium">Zamów dla klienta</h2>
											<p {...$description} class="mb-5 mt-[10px] leading-normal">
												Wybierz poniżej klienta, dla którego chcesz złożyć zamówienie. Widzisz tylko
												użytkowników, dla których jesteś doradcą
											</p>

											<label class="cursor-pointer">
												<div class="relative">
													<input
														{...$input}
														class="flex h-10 items-center justify-between rounded-md px-3 pr-12"
														placeholder="Adam Kowalski"
														use:input
														value={$inputValue}
													/>
													<div class="absolute right-1 top-1/2 z-10 -translate-y-1/2">
														{#if $comboBoxOpen}
															<ChevronUp />
														{:else}
															<ChevronDown />
														{/if}
													</div>
												</div>
											</label>

											<div
												class="z-50 flex max-h-[300px] flex-col overflow-hidden rounded-md"
												{...$menu}
												use:menu
											>
												<ul class="flex max-h-full flex-col gap-2 overflow-y-auto px-2 py-2">
													{#if $comboBoxOpen}
														{#if $filteredItems.length !== 0}
															{#each $filteredItems as adviser, index (index)}
																<li
																	{...$item({
																		index,
																		item: adviser
																	})}
																	use:item
																	class="relative cursor-pointer rounded-md py-1 pl-9 pr-4 bg-background text-muted-foreground data-[highlighted]:bg-muted data-[highlighted]:text-primary data-[disabled]:opacity-50"
																>
																	{#if $isSelected(adviser)}
																		<div class="check">
																			<Check />
																		</div>
																	{/if}
																	<div>
																		<span>{adviser.fullName}</span>
																		<span class="block text-sm opacity-70">{adviser.email}</span>
																	</div>
																</li>
															{/each}
														{:else}
															<li
																class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 data-[highlighted]:bg-blue-400 data-[highlighted]:text-red-500"
															>
																Brak wyników
															</li>
														{/if}
													{/if}
												</ul>
											</div>

											<div class="mt-[25px] flex justify-end gap-4">
												<button
													{...$close}
													use:close
													class="inline-flex h-[35px] items-center justify-center rounded-[4px] px-4 font-medium leading-none"
												>
													Anuluj
												</button>
												<button
													{...$close}
													use:close
													class="inline-flex h-[35px] items-center justify-center rounded-[4px] px-4 font-medium leading-none"
												>
													Zapisz wybór
												</button>
											</div>

											<button
												{...$close}
												use:close
												aria-label="Zamknij"
												class="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full"
											>
												<X />
											</button>
										</div>
									{/if}
								</div>
							</div>
						{/if}

						{#if data.cart.customer.id !== data.cart.ownerId}
							<Separator class="my-1" />

							<p>Zamawiasz dla {data.cart.customer.fullName}</p>
						{/if}
					{/if}
				</div>
			</div>
		</form>
	{:else}
		<div class="text-center mt-7">
			<h1 class="text-2xl xxs:text-3xl sm:text-5xl font-bold mb-1 xxs:mb-1.5 sm:mb-2">
				Koszyk jest pusty 😔
			</h1>
			<a class="xxs:text-lg sm:text-xl py-1 xxs:py-1.5 sm:py-2" href="/sklep"
				>Kliknij tutaj, aby przejść do sklepu 🛍️</a
			>
		</div>
	{/if}
</section>

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2 text-accent;
		translate: 0 calc(-50% + 1px);
	}
</style>
