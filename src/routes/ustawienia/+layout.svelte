<script lang="ts">
	import { Separator } from '$components/ui/separator';
	import SidebarNav from './(components)/sidebar-nav.svelte';

	const sidebarNavItems = [
		{
			title: 'Profil',
			href: '/ustawienia'
		},
		{
			title: 'Preferencje',
			href: '/ustawienia/preferencje'
		}
	];
</script>

<div class="hidden p-10 pb-16 gap-y-6 md:block">
	<div class="gap-y-0.5">
		<h1 class="text-2xl font-bold tracking-tight">Ustawienia</h1>
		<p class="text-muted-foreground">Zarządzaj ustawieniami konta i aplikacji</p>
	</div>
	<Separator class="my-6" />
	<div class="flex flex-col gap-y-8 lg:flex-row lg:gap-x-12 lg:gap-y-0">
		<aside class="lg:w-1/5">
			<SidebarNav items={sidebarNavItems} />
		</aside>
		<div class="flex-1 lg:max-w-2xl">
			<slot />
		</div>
	</div>
</div>
