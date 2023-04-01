<script lang="ts">
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import { cart, changeCartState } from '$lib/client/stores/cart';
	import { onMount } from 'svelte';
	import wretch from 'wretch';
	import toast from 'svelte-french-toast';
	import { imagesSorting } from '$lib/client/functions/sorting';
	import { orderValidation } from '$lib/client/schemas/order';
	import { betterZodParse } from '$lib/client/functions/betterZodParse';
	import type { CartProduct } from '$types';

	export let data;

	const synchronizeCart = async () => {
		const productIds = $cart.products.map((product) => product.id);

		console.log('urlXD', data.url);

		if (!productIds.length) return;

		if (!data.url.toLowerCase().endsWith('/zamowienie/koszyk') || $cart.status === 'verified')
			return;

		try {
			changeCartState('loading');

			const syncCartPromise = wretch(`/api/mycart?cart=${productIds.join(',')}`)
				.get()
				.json<{
					success: true;
					products: CartProduct[];
				}>();

			toast.promise(syncCartPromise, {
				error: 'Nie udało się zsynchronizować koszyka',
				success: 'Koszyk zsynchronizowany',
				loading: 'Synchronizowanie koszyka...'
			});

			const cartData = await syncCartPromise;

			console.log('cartData', cartData);

			const cartLocalProducts = cartData.products.map((product) => {
				return {
					...product,
					images: product.images.sort(imagesSorting),
					quantity: $cart.products.find((p) => p.id === product.id)?.quantity || 1
				};
			});

			cart.update((cartObj) => {
				return {
					...cartObj,
					lastVerified: new Date(),
					status: 'verified',
					products: cartLocalProducts
				};
			});
		} catch (error) {
			let errorMessage = 'Wystąpił błąd podczas pobierania koszyka';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			toast.error(errorMessage);
			cart.update((cartObj) => {
				return { ...cartObj, status: 'error' };
			});
		}
	};

	const createOrder = async () => {
		// if ($cart.status !== 'verified') {
		// 	toast.error('Koszyk nie jest zsynchronizowany');
		// 	return;
		// }

		if ($cart.products.length === 0) {
			toast.error('Koszyk jest pusty');
			return;
		}

		if (!$cart.deliveryMethod) {
			toast.error('Nie wybrano metody dostawy');
			return;
		}

		if (!$cart.paymentMethod) {
			toast.error('Nie wybrano metody płatności');
			return;
		}

		if ($cart.deliveryMethod !== 'personal-pickup' && $cart.isAddressValid !== true) {
			toast.error('Niepoprawny adres');
			return;
		}

		try {
			const [order, orderParseError] = betterZodParse(orderValidation, {
				products: $cart.products.map((product) => ({
					productId: product.id,
					quantity: product.quantity
				})),
				deliveryMethod: $cart.deliveryMethod,
				paymentMethod: $cart.paymentMethod,
				customerName: $cart.customerName,
				address: $cart.address,
				promoCode: $cart.promoCode
			});

			if (orderParseError) {
				toast.error(orderParseError[0]);
				return;
			}

			const createOrderPromise = wretch('/api/order/create')
				.post(order)
				.json<{ success: true; orderId: string }>();

			toast.promise(createOrderPromise, {
				error: 'Nie udało się złożyć zamówienia',
				success: 'Złożono zamówienie',
				loading: 'Składanie zamówienia...'
			});

			const data = await createOrderPromise;

			// toast.success('Pomyślnie złożono zamówienie');

			// clearCart();
		} catch (error) {
			console.error(error);
		}
	};

	onMount(() => {
		synchronizeCart();
	});

	$: subtotal = $cart.products
		? $cart.products.map(({ price, quantity }) => price * quantity).reduce((a, b) => a + b, 0)
		: 0;

	const stageNames = ['Koszyk', 'Dostawa', 'Płatność', 'Potwierdzenie'];
	const stages = ['koszyk', 'dostawa', 'platnosc', 'potwierdzenie'] as const;
	let stageIndex: number = 0;

	// export let data

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
			} else if (stage === 'potwierdzenie') {
				stageIndex = 3;
			}
		}
	}

	$: disableNextStep =
		(stageIndex === 1 && !$cart.deliveryMethod) ||
		(stageIndex === 2 && !$cart.paymentMethod) ||
		(stageIndex === 1 &&
			$cart.deliveryMethod !== 'personal-pickup' &&
			$cart.isAddressValid === false);

	$: console.log('cart', $cart);
</script>

<section class="w-full flex flex-col items-center justify-center">
	{#if $cart.products && $cart.products.length === 0}
		<div class="text-center mt-7">
			<h1 class="text-2xl xxs:text-3xl sm:text-5xl font-bold mb-1 xxs:mb-1.5 sm:mb-2">
				Koszyk jest pusty 😔
			</h1>
			<a
				class="xxs:text-lg sm:text-xl text-base-content hover:text-primary py-1 xxs:py-1.5 sm:py-2"
				href="/sklep">Kliknij tutaj, aby przejść do sklepu 🛍️</a
			>
		</div>
	{:else}
		<ul class="steps py-2">
			<li data-content="🛒" class="step {stageIndex >= 0 ? 'step-primary' : 'step-neutral'}">
				{stageNames[0]}
			</li>
			<li data-content="🚚" class="step {stageIndex >= 1 ? 'step-primary' : 'step-neutral'}">
				{stageNames[1]}
			</li>
			<li data-content="💵" class="step {stageIndex >= 2 ? 'step-primary' : 'step-neutral'}">
				{stageNames[2]}
			</li>
			<li data-content="👍" class="step {stageIndex >= 3 ? 'step-primary' : 'step-neutral'}">
				{stageNames[3]}
			</li>
		</ul>

		<div class="divider" />

		<div class="w-full h-full flex lg:flex-row flex-col items-center justify-center">
			<div
				class="text-left h-full flex flex-col p-2 space-y-6 w-full lg:max-w-[700px] xl:max-w-[900px]"
			>
				<slot />
			</div>

			<div class="divider hidden md:flex md:divider-horizontal" />
			<div
				class="xl:max-w-[340px] lg:max-w-[270px] px-1 sm:px-0 w-full h-full flex flex-col space-y-4 sm:space-y-6 sticky top-0"
			>
				<h2 class="text-3xl font-bold">Podsumowanie 📒</h2>
				<div class="flex flex-col space-y-2 lg:text-base md:text-sm">
					<div class="flex justify-between items-center">
						<span class="text-base">Suma częściowa</span>
						<bold class="font-semibold text-base">{subtotal.toFixed(2)} PLN</bold>
					</div>
					<div class="flex justify-between items-center">
						<span class="text-base">Przesyłka</span>
						<bold class="font-semibold text-base">{(10).toFixed(2)} PLN</bold>
					</div>
					<div class="flex justify-between items-center">
						<span class="text-base">VAT</span>
						<bold class="font-semibold text-base">{(subtotal * 0.23).toFixed(2)} PLN</bold>
					</div>
					<div class="flex justify-between items-center">
						<span class="text-base">Rabat</span>
						<bold class="font-semibold text-base">{0} PLN</bold>
					</div>
					<div class="flex justify-between items-center">
						<bold class="font-bold text-base">Suma całkowita</bold>
						<bold class="font-bold text-base"
							>{(subtotal + 10 + subtotal * 0.23).toFixed(2)} PLN</bold
						>
					</div>
				</div>

				{#if data.url.endsWith('/koszyk')}
					<div class="w-full form-control">
						<label for="promo-code" class="label">
							<span class="label-text">Kod rabatowy</span>
						</label>
						<div class="w-full flex space-x-2">
							<input
								name="promo-code"
								type="text"
								placeholder="Wpisz tutaj..."
								class="input input-bordered w-full"
								disabled
							/>
							<button class="btn btn-secondary md:px-2 lg:px-4" disabled>Potwierdź</button>
						</div>
					</div>
				{/if}

				<div class="flex space-x-3">
					{#if stageIndex > 0}
						<a href="/zamowienie/{stages[stageIndex - 1]}" class="btn btn-accent">
							<ArrowLeft class="mr-1" /> Wstecz</a
						>
					{/if}
					{#if stageIndex === 2}
						<button
							disabled={disableNextStep}
							on:click={() => createOrder()}
							class="btn btn-primary flex-1">ZAMAWIAM <ArrowRight class="ml-1" /></button
						>
					{:else if stageIndex < stages.length - 1}
						<!-- class:btn-disabled={$cart.status === 'loading'} -->
						<a
							class:btn-disabled={disableNextStep}
							href="/zamowienie/{stages[stageIndex + 1]}"
							class="btn btn-primary flex-1"
						>
							Dalej
							<ArrowRight class="ml-1" />
						</a>
					{/if}
				</div>

				<!-- <button
					class="btn btn-ghost"
					on:click={() => {
						cart.update((oldCart) => ({
							...oldCart,
							deliveryMethod: null,
							paymentMethod: null
						}));
					}}>Reset delivery and payment methods</button
				> -->

				<!-- {#if stageIndex === 0 && ($cart.status !== 'verified' || ($cart.lastVerified || new Date()) < new Date(Date.now() - 1000 * 60 * 5))}
					<div class="flex flex-col">
						<button
							disabled={$cart.status === 'loading'}
							name="verify-cart"
							on:click={() => synchronizeCart()}
							class="btn btn-primary">Synchronizuj koszyk <RefreshCcw class="ml-2" /></button
						>

						<label for="verify-cart" class="label text-sm">
							Opcjonalne: Synchronizacja koszyka pobiera najnowszą wersję produktów w koszyku.
						</label>
					</div>
				{/if} -->
			</div>
		</div>
	{/if}
</section>
