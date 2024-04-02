<script lang="ts">
	import { page } from '$app/stores';
	// import * as Tabs from "$shadcn/tabs";

	import TabsList from '$components/custom/Layout/AdminTabs/TabsList.svelte';
	import Tab from '$components/custom/Layout/AdminTabs/Tab.svelte';
	import TabsContent from '$components/custom/Layout/AdminTabs/TabsContent.svelte';

	$: pathname = $page.url.pathname;

	const subpageLabels = {
		'/admin': 'Start',
		'/admin/zamowienia': 'Zamówienia',
		'/admin/uzytkownicy': 'Użytkownicy',
		'/admin/produkty': 'Produkty'
		// '/admin/analityka': 'Analityka'
	};

	const getSubpageLabel = (pathname: string) => {
		if (!(pathname in subpageLabels)) {
			return '?';
		}

		// @ts-ignore
		return subpageLabels[pathname];
	};
</script>

<div class="flex flex-col w-full">
	<div class="flex-1 w-full p-8 pt-6 space-y-4">
		<div class="">
			<h2 class="py-1 text-3xl font-bold tracking-tight">Panel administracyjny</h2>
			<h3 class="text-2xl font-semibold tracking-tight scroll-m-20">{getSubpageLabel(pathname)}</h3>
		</div>
		<TabsList>
			<Tab {pathname} href="/admin">Start</Tab>
			<Tab {pathname} href="/admin/zamowienia">Zamówienia</Tab>
			<!-- <Tab {pathname} href="/admin/zamowienia2">Zamówienia 2</Tab> -->
			<Tab {pathname} href="/admin/uzytkownicy">Użytkownicy</Tab>
			<Tab {pathname} href="/admin/produkty">Produkty</Tab>
			<!-- <Tab {pathname} href="/admin/analityka">Analityka</Tab> -->
		</TabsList>
		<TabsContent class="space-y-4">
			<slot />
		</TabsContent>
	</div>
</div>

<!-- <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign class="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">$45,231.89</div>
						<p class="text-xs text-muted-foreground">+20.1% from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle class="text-sm font-medium">Subscriptions</CardTitle>
						<Users class="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">+2350</div>
						<p class="text-xs text-muted-foreground">+180.1% from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle class="text-sm font-medium">Sales</CardTitle>
						<CreditCard class="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">+12,234</div>
						<p class="text-xs text-muted-foreground">+19% from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle class="text-sm font-medium">Active Now</CardTitle>
						<Activity class="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">+573</div>
						<p class="text-xs text-muted-foreground">+201 since last hour</p>
					</CardContent>
				</Card>
			</div>
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card class="col-span-4">
					<CardHeader>
						<CardTitle>Overview</CardTitle>
					</CardHeader>
					<CardContent>
					</CardContent>
				</Card>
				<Card class="col-span-3">
					<CardHeader>
						<CardTitle>Recent Sales</CardTitle>
						<CardDescription>You made 265 sales this month.</CardDescription>
					</CardHeader>
					<CardContent>
					</CardContent>
				</Card>
			</div> -->
