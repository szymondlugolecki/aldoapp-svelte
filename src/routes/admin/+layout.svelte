<script lang="ts">
	import { page } from '$app/stores';

	import { Button } from '$shadcn/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$shadcn/card';
	import TabsList from '$components/Layout/AdminTabs/TabsList.svelte';
	import Tab from '$components/Layout/AdminTabs/Tab.svelte';
	import TabsContent from '$components/Layout/AdminTabs/TabsContent.svelte';

	$: pathname = $page.url.pathname;
</script>

<div class="flex flex-col w-full">
	<div class="flex-1 space-y-4 p-8 pt-6 w-full">
		<div class="flex items-center justify-start space-y-2">
			<h2 class="text-3xl font-bold tracking-tight">Panel administracyjny</h2>
			<!-- <div class="flex items-center space-x-2">
				<Button size="sm">
					<Download class="mr-2 h-4 w-4" />
					Download
				</Button>
			</div> -->
		</div>
		<!-- <Tabs value="overview" class="space-y-4"> -->
		<TabsList>
			<Tab {pathname} href="/admin">Start</Tab>
			<Tab {pathname} href="/admin/zamowienia">Zamówienia</Tab>
			<Tab {pathname} href="/admin/uzytkownicy">Użytkownicy</Tab>
			<Tab {pathname} href="/admin/produkty">Produkty</Tab>
			<Tab {pathname} href="/admin/analityka">Analityka</Tab>
		</TabsList>
		<TabsContent class="space-y-4 justi">
			<slot />
		</TabsContent>
	</div>
</div>

<!-- <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign class="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">$45,231.89</div>
						<p class="text-xs text-muted-foreground">+20.1% from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle class="text-sm font-medium">Subscriptions</CardTitle>
						<Users class="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">+2350</div>
						<p class="text-xs text-muted-foreground">+180.1% from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle class="text-sm font-medium">Sales</CardTitle>
						<CreditCard class="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">+12,234</div>
						<p class="text-xs text-muted-foreground">+19% from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle class="text-sm font-medium">Active Now</CardTitle>
						<Activity class="h-4 w-4 text-muted-foreground" />
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
