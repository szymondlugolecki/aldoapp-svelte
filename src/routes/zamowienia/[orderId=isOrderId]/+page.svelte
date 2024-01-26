<script lang="ts">
	import { confetti } from '@neoconfetti/svelte';
	import { parseAddress } from '$lib/client/functions/index.js';
	import { page } from '$app/stores';
	import { paymentMethodsList } from '$lib/client/constants/index.js';
	import OrderProduct from '$components/custom/Order/OrderProduct.svelte';
	import HorizontalOrderSteps from '$components/custom/Steps/HorizontalOrderSteps.svelte';
	import VerticalOrderSteps from '$components/custom/Steps/VerticalOrderSteps.svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$shadcn/button';
	import ProductsTable from './(components)/products-table.svelte';
	import * as Form from '$shadcn/form';
	import { order$ } from '$lib/client/schemas';
	import MessageAlert from '$components/custom/Form/MessageAlert.svelte';
	import * as AlertDialog from '$shadcn/alert-dialog';
	import { CheckCircled } from 'radix-icons-svelte';
	import { Separator } from '$components/ui/separator';
	import { superForm } from 'sveltekit-superforms/client';
	import ErrorMessage from '$components/custom/Form/ErrorMessage.svelte';
	import Message from '$components/custom/Form/Message.svelte';

	import * as Sheet from '$shadcn/sheet';
	import { Input } from '$shadcn/input';
	import { Label } from '$shadcn/label';

	export let data;
	let open = false;

	$: justOrdered = $page.url.searchParams.get('success') === 'true';

	// onMount(() => {
	// 	if (justOrdered) {
	// 		const newURL = new URL($page.url);
	// 		newURL.searchParams.delete('success');
	// 		goto(newURL.toString()).then(() => (open = true));
	// 	}
	// });

	let innerWidth: number;
	const productsCount = data.order.products
		.map(({ quantity }) => quantity)
		.reduce((prev, quantity) => prev + quantity, 0);

	const { errors, delayed, timeout, message, enhance } = superForm(data.orderAgainForm, {
		delayMs: 1000,
		timeoutMs: 8000
	});
</script>

<svelte:head>
	<title>Zamówienie #{$page.params.orderId} • Twoje ALDO</title>
	<meta name="description" content="Zobacz szczegóły zamówienia nr #{$page.params.orderId}" />
</svelte:head>

{#if justOrdered && innerWidth}
	<div class="flex justify-center w-full absolute max-w-[90vw]">
		<div
			use:confetti={{
				duration: 2250,
				force: 0.3,
				particleCount: 75,
				stageWidth: 1200,
				stageHeight: 800,
				colors: ['#4ade80', '#22d3ee', '#f59e0b', '#ec4899']
			}}
		/>
	</div>
{/if}

<!-- <h2 use:melt={$title} class="flex items-center m-0 text-xl font-medium">
	Dziękujemy <div class="ml-1.5">
		<CheckCircle2 strokeWidth={3} class="text-green-500 w-7 h-7" />
	</div>
</h2>
<p use:melt={$description} class="mt-2 mb-2 leading-normal">
	Sprawdzamy dostępność produktów
</p> -->

<svelte:window bind:innerWidth />

<!-- use:enhance={({ formData }) => {
	const toastId = createLoadingToast('please-wait');

	formData.append('id', data.order.id.toString());
	formData.append('event', 'CANCEL');

	return async ({ result, update }) => {
		open = false;

		handleFormResponse(result, toastId);
		update();
	};
}} -->

<!-- use:enhance={({ formData }) => {
	const toastId = createLoadingToast('please-wait');

	formData.append('id', data.order.id.toString());
	formData.append('event', 'KEEP_WAITING');

	return async ({ result, update }) => {
		open = false;

		handleFormResponse(result, toastId);
		update();
	};
}} -->

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title class="inline-flex items-center gap-x-1"
				>Dziękujemy <CheckCircled class="text-green-500 square-5" /></AlertDialog.Title
			>
			<AlertDialog.Description
				>Gdy zweryfikujemy zamówienie, damy Ci znać mailowo oraz przez powiadomienia w telefonie.</AlertDialog.Description
			>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Action>Ok</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<div class="flex items-start justify-center w-full">
	<div class="w-full px-2 py-6 max-w-7xl md:px-8">
		<!-- Header -->
		<div class="flex flex-col items-center w-full px-2 sm:flex-row sm:justify-between">
			<div class="text-3xl font-bold tracking-tight">
				<h1>Zamówienie #{data.order.id}</h1>
			</div>
			<p class="text-sm">
				Zamówiono <time class="font-semibold" datetime={data.order.createdAt.toString()}>
					{data.order.createdAt.toLocaleDateString('pl-PL', {
						day: 'numeric',
						month: 'long',
						year: 'numeric'
					})}
				</time>
			</p>
		</div>

		<div class="px-2 py-8 md:px-2">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-medium">Status</h2>
				<!-- <span class={cn('font-medium', data.order.paid ? 'text-green-500' : 'text-red-400')}
					>{data.order.paid ? 'Opłacono' : 'Nieopłacono'}</span
				> -->
			</div>

			<!-- {#if data.order.status === 'awaitingCustomerDecision'}
				<div class="flex py-4 border rounded-sm shadow-md border-warning">
					<div class="min-w-[60px] flex justify-center items-start">
						<AlertTriangle class="w-8 h-8 text-warning" />
					</div>
					<div class="flex flex-col gap-y-3">
						<div class="flex flex-col pr-4 gap-y-2">
							<p class="text-lg font-medium">Wymagana jest akcja</p>
							<p class="text-sm">
								Przynajmniej jeden z produktów, które zamówiłeś jest niedostępny. Możesz poczekać na
								dostępność lub anulować zamówienie. Jeżeli zdecydujesz się zaczekać, twoje
								zamówienie zostanie automatycznie wznowione po uzupełnieniu produktów na stanie.
							</p>
						</div>

						<div class="flex flex-col sm:flex-row gap-x-6">
							<form method="post" action="?/changeOrderStatus" class="">
								<Button variant="default" class="mt-3 max-w-[270px] font-medium"
									>Poczekaj na dostępność</Button
								>
								<input type="hidden" name="id" value={data.order.id} />
								<input type="hidden" name="event" value="KEEP_WAITING" />
							</form>
							<form method="post" action="?/changeOrderStatus" class="">
								<Button variant="destructive" class="mt-3 max-w-[270px]">Anuluj zamówienie</Button>
								<input type="hidden" name="id" value={data.order.id} />
								<input type="hidden" name="event" value="CANCEL" />
							</form>
						</div>
					</div>
				</div>
			{:else} -->
			<div class="p-4 border rounded-md shadow-sm border-border">
				<HorizontalOrderSteps
					orderStatus={data.order.status}
					deliveryMethod={data.order.deliveryMethod}
					class="flex-col hidden sm:flex"
				/>
				<VerticalOrderSteps
					orderStatus={data.order.status}
					deliveryMethod={data.order.deliveryMethod}
					class="inline sm:hidden"
				/>
			</div>
			<!-- {/if} -->
		</div>

		<div class="px-2 py-8 md:px-2">
			<h3 class="mb-6 text-xl font-medium">Szczegóły zamówienia</h3>
			<div class="p-4 border rounded-md shadow-sm border-border">
				<dl class="grid grid-cols-1 text-sm ss:grid-cols-2 gap-y-4">
					<div
						class="border-border ss:[&:not(:last-child)]:border-b-0 [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-3"
					>
						<dt class="font-medium">Całkowita kwota</dt>
						<dd class="mt-3">
							<span class="block"
								><span class="font-semibold text-blue-600">{data.order.price} PLN</span></span
							>
							<!-- <span class="block"
							>Rabat <span class="font-medium">{data.order.discount} PLN</span></span
						> -->
						</dd>
					</div>

					<div
						class="border-border ss:[&:not(:last-child)]:border-b-0 [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-3"
					>
						<dt class="font-medium">Adres dostawy</dt>
						<dd class="mt-3 whitespace-pre-line">{parseAddress(data.order.address)}</dd>
					</div>
					<div
						class="border-border ss:[&:not(:last-child)]:border-b-0 [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-3"
					>
						<dt class="font-medium">Metoda płatności</dt>
						<dd class="mt-3">
							{paymentMethodsList[data.order.paymentMethod]}
						</dd>
					</div>
					<div
						class="border-border ss:[&:not(:last-child)]:border-b-0 [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-3"
					>
						<dt class="font-medium">Zleceniodawca</dt>
						<dd class="flex mt-3">
							<a href="/uzytkownik/{data.order.cartOwner.id}" class="underline"
								>{data.order.cartOwner.fullName}</a
							>
						</dd>
					</div>
					<div
						class="border-border ss:[&:not(:last-child)]:border-b-0 [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-3"
					>
						<dt class="font-medium">Klient</dt>
						<dd class="flex mt-3">
							<a href="/uzytkownik/{data.order.customer.id}" class="underline"
								>{data.order.customer.fullName}</a
							>
						</dd>
					</div>
				</dl>
			</div>
		</div>

		<div class="px-2 py-8 md:px-2">
			<h4 class="mb-6 text-xl font-medium">Produkty ({productsCount})</h4>

			<div>
				<div class="overflow-x-auto border rounded-md shadow-sm border-border">
					<ProductsTable products={data.order.products} />
				</div>
			</div>
		</div>

		<div class="flex flex-col px-2 py-8 md:px-2 gap-y-4">
			<div class="">
				<h5 class="text-xl font-medium tracking-tight">Inne</h5>
				<p class="text-sm text-muted-foreground">Zarządzaj zamówieniem</p>
			</div>

			<Separator />

			<div class="grid grid-cols-2 gap-4">
				<div class="col-span-2 sm:col-span-1">
					<div class="">
						<label
							for="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>Potwórz zamówienie</label
						>
					</div>
					<p class="text-sm text-muted-foreground">
						Produkty z tego zamówienia zostaną dodane do Twojego koszyka
					</p>
					<Message message={$message} />
					{#if $timeout}
						<ErrorMessage errors={['Brak odpowiedzi serwera']} />
					{/if}
					<ErrorMessage errors={$errors.id} />
				</div>
				<div class="sm:justify-self-end sm:place-self-center">
					<form action="?/orderAgain" method="post" use:enhance>
						<input type="hidden" name="id" value={data.order.id} />
						<Button variant="default" class="max-w-[270px]">Potwórz zamówienie</Button>
					</form>
				</div>
			</div>

			<Separator />

			<div class="grid grid-cols-2 gap-4">
				<div class="col-span-2 sm:col-span-1">
					<div class="">
						<label
							for="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>Historia statusu</label
						>
					</div>
					<p class="text-sm text-muted-foreground">Sprawdź jak zmieniał się status zamówienia</p>
				</div>
				<div class="sm:justify-self-end sm:place-self-center">
					<Button
						href="historia"
						data-sveltekit-preload-data="hover"
						on:click={async (e) => {
							// bail if opening a new tab, or we're on too small a screen
							if (e.metaKey || innerWidth < 640) return;

							// prevent navigation
							e.preventDefault();

							// @ts-ignore
							const { href } = e.currentTarget;

							// run `load` functions (or rather, get the result of the `load` functions
							// that are already running because of `data-sveltekit-preload-data`)
							// const result = await preloadData(href);

							// if (result.type === 'loaded' && result.status === 200) {
							// pushState(href, { selected: result.data });
							goto(href, {
								state: {
									historyModalOpen: true
								}
							});
							// } else {
							// something bad happened! try navigating
							goto(href);
							// }
						}}
						variant="default"
						class="max-w-[270px]">Historia statusu</Button
					>
				</div>
			</div>
		</div>
	</div>
</div>

{#if $page.state.historyModalOpen}
	<Sheet.Root
		onOpenChange={(isOpen) => {
			if (isOpen === false) {
				history.back();
			}
		}}
	>
		<Sheet.Trigger asChild let:builder>
			<Button builders={[builder]} variant="outline">Open</Button>
		</Sheet.Trigger>
		<Sheet.Content side="right">
			<Sheet.Header>
				<Sheet.Title>Edit profile</Sheet.Title>
				<Sheet.Description>
					Make changes to your profile here. Click save when you're done.
				</Sheet.Description>
			</Sheet.Header>
			<div class="grid gap-4 py-4">
				<div class="grid items-center grid-cols-4 gap-4">
					<Label for="name" class="text-right">Name</Label>
					<Input id="name" value="Pedro Duarte" class="col-span-3" />
				</div>
				<div class="grid items-center grid-cols-4 gap-4">
					<Label for="username" class="text-right">Username</Label>
					<Input id="username" value="@peduarte" class="col-span-3" />
				</div>
			</div>
			<Sheet.Footer>
				<Sheet.Close asChild let:builder>
					<Button builders={[builder]} type="submit">Save changes</Button>
				</Sheet.Close>
			</Sheet.Footer>
		</Sheet.Content>
	</Sheet.Root>

	<Modal on:close={() => history.back()}>
		<!-- pass page data to the +page.svelte component,
			 just like SvelteKit would on navigation -->
		<PhotoPage data={$page.state.selected} />
	</Modal>
{/if}
