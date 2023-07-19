<script lang="ts">
	import { confetti } from '@neoconfetti/svelte';
	import { addressParser, cn, dateParser, flexRender } from '$lib/client/functions/index.js';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$shadcn/table';
	import { createTabs } from '@melt-ui/svelte';
	import {
		createSvelteTable,
		getCoreRowModel,
		type ColumnDef,
		type TableOptions,
	} from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import TableImage from '$components/Table/TableImage.svelte';
	import TableTextColumn from '$components/Table/TableTextColumn.svelte';
	import { orderStatusList } from '$lib/client/constants/index.js';
	import {
		BatteryFull,
		BatteryCharging,
		CalendarClock,
		CalendarPlus,
		Car,
		DollarSign,
		Home,
		User,
		UserCog,
		XSquare,
		Landmark,
		Banknote,
		BookmarkMinus,
		CheckCircle2
	} from 'lucide-svelte';

	export let data;

	$: justOrdered = $page.url.searchParams.get('success') === 'true';

	$: console.log('justOrdered', justOrdered);

	const productImgUrl =
		'https://res.cloudinary.com/dzcuq1b2u/image/upload/v1680687127/products/Lacto%20Start%20IPC%20pasza%20rozdojeniowa%20De%20Heus%2025kg/DB4A2X00G-W00/0.webp';

	type ParsedProduct = (typeof data.order.products)[number];

	const defaultColumns: ColumnDef<ParsedProduct>[] = [
		{
			id: 'id',
			accessorKey: 'id',
			enableSorting: false
		},
		{
			id: 'encodedURL',
			header: 'Link',
			accessorKey: 'encodedURL',
			cell: (info) =>
				flexRender(TableImage, {
					href: `/sklep/${info.getValue()}`,
					imgSrc: productImgUrl,
					alt: 'Opakowanie'
				})
		},
		{
			id: 'product',
			header: 'Produkt',
			accessorKey: 'name',
			cell: (info) => {
				const product = info.table.options.data.find(
					(product) => product.id === info.row._getAllCellsByColumnId().id.getValue()
				);

				const name = product && product.name;
				const symbol = product && product.symbol;

				if (!name || !symbol) return '?';

				return flexRender(TableTextColumn, {
					textArray: [name, symbol]
				});
			}
		},
		{
			id: 'price',
			header: 'Cena',
			accessorKey: 'price',
			cell: (info) => {
				const product = info.table.options.data.find(
					(product) => product.id === info.row._getAllCellsByColumnId().id.getValue()
				);

				if (!product) return '?';

				if (product.quantity === 1) {
					return Number(product.price).toFixed(2);
				}

				return `${(product.quantity * Number(product.price)).toFixed(2)} (${
					product.quantity
				} x ${Number(product.price).toFixed(2)})`;
			}
		},
		{
			id: 'quantity',
			header: 'Ilość',
			accessorKey: 'quantity',
			cell: (info) => {
				const product = info.table.options.data.find(
					(product) => product.id === info.row._getAllCellsByColumnId().id.getValue()
				);

				if (!product) return '?';

				return Number(product.quantity);
			}
		}
		// {
		// 	id: 'status',
		// 	header: 'Status',
		// 	accessorKey: 'status',
		// 	cell: () => {
		// 		const { status, paymentStatus, deliveryStatus } = data.order;

		// 		return flexRender(TableTextColumn, {
		// 			textArray: [
		// 				orderStatusList[status],
		// 				`${''}`,
		// 				`Płatność: ${orderStatusList[paymentStatus]}`,
		// 				`Dostawa: ${orderStatusList[deliveryStatus]}`
		// 			]
		// 		});
		// 	}
		// }
		// {
		// 	id: 'address',
		// 	header: 'Adres dostawy',
		// 	accessorKey: 'address',
		// 	cell: (info) => {
		// 		if (data.order.deliveryMethod === 'personal-delivery') {
		// 			if (data.order.address) {
		// 				return addressParser(info.getValue() as Address | string | null);
		// 			}
		// 			return 'Brak adresu❗';
		// 		}
		// 		return '?';
		// 		// return 'Odbiór osobisty'
		// 	}
		// },
		// {
		// 	id: 'createdAt',
		// 	header: 'Dodano',
		// 	accessorKey: 'createdAt',
		// 	cell: (info) => info.getValue()
		// }
	];

	$: options = writable<TableOptions<ParsedProduct>>({
		data: data.order.products,
		columns: defaultColumns,
		getCoreRowModel: getCoreRowModel(),
		state: {
			columnVisibility: {
				id: false
			}
		}
	});

	$: table = createSvelteTable(options);

	$: console.log('order', data.order);

	$: defaultTab = justOrdered ? 'thankyou' : 'info';
	const { root, list, content, trigger } = createTabs({ value: defaultTab });
	let innerWidth: number;
</script>

<!-- <div class="flex flex-col">
	<span>siema</span>
	<span>Id: {data.order.id}</span>
	<span>Kwota: {data.order.price} PLN</span>
	<span>Adres: {data.order.address}</span>
	<span>Status: {data.order.status}</span>
	<span>Klient: {data.order.customer.fullName}</span>
	<span>Zleceniodawca: {data.order.customer.fullName}</span>
</div> -->

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

<svelte:window bind:innerWidth />
<div class="w-full flex justify-center items-start">
	<div {...$root} class="root">
		<div {...$list} class="list" aria-label="Zobacz swoje zamówienie">
			{#if justOrdered}
				<button {...$trigger('thankyou')} use:trigger class="trigger">Dziękujemy</button>
			{/if}
			<button {...$trigger('info')} use:trigger class="trigger">Informacje</button>
			<button {...$trigger('products')} use:trigger class="trigger">Produkty</button>
			<button {...$trigger('delivery')} use:trigger class="trigger">Dostawa</button>
			<button {...$trigger('payment')} use:trigger class="trigger">Płatność</button>
		</div>
		<div {...$content('thankyou')} class="content">
			<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center">
				Dziękujemy Ci
				<div class="ml-3">
					<CheckCircle2 strokeWidth={1.75} class="w-16 h-16 text-green-500" />
				</div>
			</h1>
			<h2
				class="scroll-m-20 border-b pb-2 text-xl xs:text-2xl md:text-3xl font-semibold tracking-tight transition-colors first:mt-0"
			>
				za złożenie zamówienia
			</h2>
			<!-- <p class="leading-7 [&:not(:first-child)]:mt-6">
				Będziemy informować cię o zmianach w statusie zamówienia przez powiadomienia w aplikacji,
				więc nie zapomnij ich włączyć w <a class="text-blue-700" href="/ustawienia"
					>ustawieniach aplikacji</a
				>.
			</p> -->
			<blockquote class="mt-2 border-l-2 pl-6 italic">
				Będziemy Cię informować o zmianach w statusie zamówienia przez powiadomienia w aplikacji.
				Nie zapomnij ich włączyć w <a class="text-blue-700" href="/ustawienia">ustawieniach</a>.
				<br /> Zespół ALDO
			</blockquote>
			<!-- <p class="leading-7 [&:not(:first-child)]:mt-6">
				
			</p> -->
		</div>
		<div {...$content('info')} class="content">
			<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Zamówienie nr #{data.order.id}
			</h1>
			<h2
				class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
			>
				Podstawowe informacje
			</h2>
			<div class="mt-3 max-w-[356px] text-sm xs:text-base">
				<Table>
					<TableBody>
						<TableRow>
							<TableCell>
								{#if data.order.status === 'pending'}
									<BatteryCharging class="w-6 h-6 mr-2" />
								{:else if data.order.status === 'canceled'}
									<XSquare class="w-6 h-6 mr-2" />
								{:else if data.order.status === 'completed'}
									<BatteryFull class="w-6 h-6 mr-2" />
								{/if}
							</TableCell>
							<TableCell>Status</TableCell>
							<TableCell class="font-medium">{orderStatusList[data.order.status]}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<User class="w-6 h-6 mr-2" />
							</TableCell>
							<TableCell>Klient</TableCell>
							<TableCell class="font-medium">{data.order.customer.fullName}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<UserCog class="w-6 h-6 mr-2" />
							</TableCell>
							<TableCell>Zleceniodawca</TableCell>
							<TableCell class="font-medium">{data.order.cartOwner.fullName}</TableCell>
						</TableRow>
						{#if data.order.createdAt}
							<TableRow>
								<TableCell>
									<CalendarClock class="w-6 h-6 mr-2" />
								</TableCell>
								<TableCell>Złożono</TableCell>
								<TableCell class="font-medium">{dateParser(data.order.createdAt, 'long')}</TableCell
								>
							</TableRow>
						{/if}
						{#if data.order.updatedAt}
							<TableRow>
								<TableCell>
									<CalendarPlus class="w-6 h-6 mr-2" />
								</TableCell>
								<TableCell>Ostatnia aktualizacja</TableCell>
								<TableCell class="font-medium">{dateParser(data.order.updatedAt, 'long')}</TableCell
								>
							</TableRow>
						{/if}
						<TableRow>
							<TableCell>
								<DollarSign class="w-6 h-6 mr-2" />
							</TableCell>
							<TableCell>Kwota</TableCell>
							<TableCell class="font-medium">{data.order.price} PLN</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
		<div {...$content('products')} class="content">
			<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Zamówienie nr #{data.order.id}
			</h1>
			<h2
				class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
			>
				Zamówione produkty
			</h2>
			<Table>
				<TableHeader>
					{#each $table.getHeaderGroups() as headerGroup}
						<TableRow changeBgOnHover={false}>
							{#each headerGroup.headers as header}
								{#if !header.isPlaceholder}
									<TableHead>
										<svelte:component
											this={flexRender(header.column.columnDef.header, header.getContext())}
										/>
									</TableHead>
								{/if}
							{/each}
						</TableRow>
					{/each}
				</TableHeader>
				<TableBody>
					{#each $table.getRowModel().rows as row, bodyRowIndex}
						<TableRow key={bodyRowIndex}>
							{#each row.getVisibleCells() as cell}
								<TableCell class="font-medium"
									><svelte:component
										this={flexRender(cell.column.columnDef.cell, cell.getContext())}
									/></TableCell
								>
							{/each}
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</div>
		<div {...$content('delivery')} class="content">
			<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Zamówienie nr #{data.order.id}
			</h1>
			<h2
				class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
			>
				Szczegóły dostawy
			</h2>
			<div class="mt-3 max-w-[356px] text-sm xs:text-base">
				<Table>
					<TableBody>
						<TableRow>
							<TableCell>
								{#if data.order.deliveryStatus === 'pending'}
									<BatteryCharging class="w-6 h-6" />
								{:else if data.order.deliveryStatus === 'canceled'}
									<XSquare class="w-6 h-6" />
								{:else if data.order.deliveryStatus === 'delivered'}
									<BatteryFull class="w-6 h-6" />
								{/if}
							</TableCell>
							<TableCell>Status dostawy</TableCell>
							<TableCell class="font-medium">{orderStatusList[data.order.deliveryStatus]}</TableCell
							>
						</TableRow>
						<TableRow>
							<TableCell>
								<Car class="w-6 h-6" />
							</TableCell>
							<TableCell>Metoda dostawy</TableCell>
							<TableCell class="font-medium"
								>{data.order.deliveryMethod === 'personal-delivery'
									? 'Kierowca ALDO'
									: '?'}</TableCell
							>
						</TableRow>
						<TableRow>
							<TableCell>
								<Home class="w-6 h-6" />
							</TableCell>
							<TableCell>Adres dostawy</TableCell>
							<TableCell class="font-medium">{addressParser(data.order.address)}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<User class="w-6 h-6" />
							</TableCell>
							<TableCell>Dostawca</TableCell>
							<TableCell class="font-medium">{data.order.driver?.fullName || 'Brak'}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
		<div {...$content('payment')} class="content">
			<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Zamówienie nr #{data.order.id}
			</h1>
			<h2
				class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
			>
				Szczegóły płatności
			</h2>
			<div class="mt-3 max-w-[356px] text-sm xs:text-base">
				<Table>
					<TableBody>
						<TableRow>
							<TableCell>
								{#if data.order.paymentStatus === 'pending'}
									<BatteryCharging class="w-6 h-6" />
								{:else if data.order.paymentStatus === 'canceled'}
									<XSquare class="w-6 h-6" />
								{:else if data.order.paymentStatus === 'completed'}
									<BatteryFull class="w-6 h-6" />
								{/if}
							</TableCell>
							<TableCell>Status płatności</TableCell>
							<TableCell class="font-medium">{orderStatusList[data.order.paymentStatus]}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								{#if data.order.paymentMethod === 'transfer'}
									<Landmark class="w-6 h-6" />
								{:else if data.order.paymentMethod === 'cash'}
									<Banknote class="w-6 h-6" />
								{/if}
							</TableCell>
							<TableCell>Metoda płatności</TableCell>
							<TableCell class="font-medium"
								>{data.order.paymentMethod === 'cash'
									? 'Gotówka/Przedpłata'
									: data.order.paymentMethod === 'transfer'
									? 'Przelew bankowy'
									: '?'}</TableCell
							>
						</TableRow>
						<TableRow>
							<TableCell>
								<DollarSign class="w-6 h-6" />
							</TableCell>
							<TableCell>Kwota</TableCell>
							<TableCell class="font-medium"
								>{data.order.price} PLN {#if data.order.price !== data.order.noDiscountPrice}
									<span class="line-through">{data.order.noDiscountPrice}</span>
								{/if}</TableCell
							>
						</TableRow>
						<TableRow>
							<TableCell>
								<BookmarkMinus class="w-6 h-6" />
							</TableCell>
							<TableCell>Rabat</TableCell>
							<TableCell class="font-medium">{data.order.discount} PLN</TableCell>
						</TableRow>
						{#if data.order.paymentMethod === 'transfer'}
							<TableRow>
								<TableCell>
									<Landmark class="w-6 h-6" />
								</TableCell>
								<TableCell>Dane do przelewu</TableCell>
								<TableCell class="font-medium"
									><div class="flex flex-col">
										<span>Numer konta: abcd-efgh-ijkl-mnop</span>
										<span>Tytuł przelewu: zamowienie{data.order.id}</span>
									</div></TableCell
								>
							</TableRow>
						{/if}
					</TableBody>
				</Table>
			</div>
		</div>
	</div>
</div>

<!-- <Tabs value="account" class="w-[400px]">
	<TabsList class="grid w-full grid-cols-2">
		<TabsTrigger value="account">Account</TabsTrigger>
		<TabsTrigger value="password">Password</TabsTrigger>
	</TabsList>
	<TabsContent value="account">
		<Card>
			<CardHeader>
				<CardTitle>Account</CardTitle>
				<CardDescription>
					Make changes to your account here. Click save when you're done.
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-2">
				<div class="space-y-1">
					<Label for="name">Name</Label>
					<Input id="name" value="Pedro Duarte" />
				</div>
				<div class="space-y-1">
					<Label for="username">Username</Label>
					<Input id="username" value="@peduarte" />
				</div>
			</CardContent>
			<CardFooter>
				<Button>Save changes</Button>
			</CardFooter>
		</Card>
	</TabsContent>
	<TabsContent value="password">
		<Card>
			<CardHeader>
				<CardTitle>Password</CardTitle>
				<CardDescription>
					Change your password here. After saving, you'll be logged out.
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-2">
				<div class="space-y-1">
					<Label for="current">Current password</Label>
					<Input id="current" type="password" />
				</div>
				<div class="space-y-1">
					<Label for="new">New password</Label>
					<Input id="new" type="password" />
				</div>
			</CardContent>
			<CardFooter>
				<Button>Save password</Button>
			</CardFooter>
		</Card>
	</TabsContent>
</Tabs> -->
<style lang="postcss">
	/* Tab Parts */
	.root {
		@apply w-full max-w-screen-lg flex flex-col overflow-hidden rounded-md shadow-lg data-[orientation=vertical]:flex-row;
	}

	.list {
		@apply flex shrink-0 border-b data-[orientation=vertical]:flex-col
			data-[orientation=vertical]:border-r;
		overflow-x: auto;
	}

	.trigger {
		@apply flex h-11 flex-1 cursor-default select-none items-center
      justify-center rounded-none px-4 leading-none
			 focus:relative;
	}

	.trigger[data-orientation='vertical'] {
		@apply w-full flex-grow-0 rounded-none border-b border-r-2 border-transparent py-4 last:border-b-0;
	}

	.trigger[data-state='active'] {
		@apply focus:relative;
	}

	.trigger[data-state='active'][data-orientation='horizontal'] {
		@apply shadow-[inset_0_-1px_0_0,0_1px_0_0] shadow-current focus:relative;
	}

	.trigger[data-state='active'][data-orientation='vertical'] {
		/* @apply border-r-magnum-500; */
	}

	.content {
		@apply grow p-5;
	}

	/* Content Elements */
	.description {
		@apply leading-normal;
	}

	.actions {
		@apply mt-5 flex justify-end;
	}

	button {
		@apply inline-flex h-8 cursor-default items-center justify-center rounded px-[15px] font-medium leading-none;
	}
</style>
