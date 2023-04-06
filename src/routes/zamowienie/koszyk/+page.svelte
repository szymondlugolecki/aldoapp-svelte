<script lang="ts">
	import { cart, decrementProduct, incrementProduct, removeProduct } from '$lib/client/stores/cart';
	import { Minus, Plus, X } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Koszyk {$cart.products.length ? `(${$cart.products.length}) ` : ''}• Twoje ALDO</title>
	<meta name="description" content="Twój koszyk. Dokończ zamówienie." />
</svelte:head>

<h1 class="text-3xl font-bold">Twój koszyk 🛒</h1>

<div class="overflow-x-auto">
	<table class="table w-full">
		<!-- head -->
		<thead>
			<tr>
				<th>Zdjęcie</th>
				<th>Produkt</th>
				<th>Cena (PLN)</th>
				<th>Ilość</th>
				<th>Usuń</th>
			</tr>
		</thead>
		<tbody>
			{#each $cart.products as product}
				<tr>
					<td>
						<a
							href="/sklep/{product.encodedURL}"
							class="rounded min-w-[4rem] w-16 h-16 xs:w-24 xs:h-24"
						>
							<img src={product.images[0]} width="96px" height="96px" alt={product.name} />
						</a>
					</td>
					<td>
						<div class="flex flex-col items-start flex-1 text-base-content space-y-1 max-w-[340px]">
							<bold class="font-bold text-xs sm:text-sm lg:text-base truncate max-w-[300px]"
								>{product.name}</bold
							>
							<small class="text-xs sm:text-sm lg:text-base">{product.symbol}</small>
							<small class="text-xs sm:text-sm lg:text-base">{product.price} zł / szt.</small>
						</div>
					</td>
					<td class="min-w-[130px]">{(product.quantity * Number(product.price)).toFixed(2)}</td>
					<td>
						<div class="flex">
							<button class="btn btn-square" on:click={() => incrementProduct(product.id)}>
								<Plus />
							</button>

							<div class="h-12 w-12 flex justify-center items-center text-center">
								<span class="text-lg xl:text-xl">{product.quantity}</span>
							</div>
							<button
								class="btn btn-square btn-outline"
								on:click={() => decrementProduct(product.id)}
							>
								<Minus />
							</button>
						</div>
					</td>
					<td
						><button
							class="btn btn-ghost"
							on:click={() => removeProduct(product.id)}
							aria-label="Usuń"><X /></button
						></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- <div class="flex flex-col space-y-3">
		{#each $cart.products as product}
			<div class="flex items-center">
				<a href="/sklep/{product.encodedURL}" class="rounded w-16 h-16 xs:w-24 xs:h-24">
					<img src={product.images[0]} alt={product.name} />
				</a>
				<div class="flex-1 py-0.5 px-3 flex">
					<div class="flex flex-col items-start flex-1 text-base-content space-y-1">
						<bold class="font-bold text-xs sm:text-sm lg:text-base">{product.name}</bold>
						<small class="text-xs sm:text-sm lg:text-base">{product.symbol}</small>
						<bold class="font-semibold text-sm sm:text-base mt-auto">{product.price} PLN</bold>
					</div>
					<div>
						<button class="btn btn-ghost btn-sm" on:click={() => removeProduct(product.id)}
							>Usuń</button
						>
					</div>
				</div>
			</div>
			<div class="divider " />
		{/each}
	</div> -->
<!-- {:else if $cart.status === 'error'}
	<Alert message="Nieudało się pobrać koszyka" type="error" /> -->
<!-- {:else if $cart.status === 'loading'}
	<span class="sr-only">Ładowanie produktów</span>
	<div class="flex flex-col space-y-3">
		{#each Array(3) as _, i}
			<div role="status" class="flex animate-pulse items-center">
				<div class="rounded w-16 h-16 xs:w-24 xs:h-24">
					<svg
						class=" w-16 h-16 xs:w-24 xs:h-24 text-base-content"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
						fill="currentColor"
						viewBox="0 0 640 512"
						><path
							d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"
						/></svg
					>
				</div>
				<div class="flex-1 py-0.5 px-3 flex h-full">
					<div class="flex flex-col pb-2 xs:pb-3">
						<div
							class="h-2 xs:h-2.5 bg-base-content rounded-full w-[160px] xxs:w-[200px] mb-2 xs:mb-4"
						/>
						<div class="h-1.5 xs:h-2 bg-base-content rounded-full w-16" />
						<div class="h-1.5 xs:h-2 bg-base-content rounded-full w-16 mt-auto" />
					</div>
				</div>
			</div>
			<div class="divider" />
		{/each}
	</div> -->

<!-- {/if} -->
<style>
	.table th:first-child {
		position: static;
	}
</style>
