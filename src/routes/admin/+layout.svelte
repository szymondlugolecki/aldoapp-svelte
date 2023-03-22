<script lang="ts">
	import { List, LineChart, Users, Dna, LayoutList } from 'lucide-svelte';
	import { page } from '$app/stores';
	$: activeUrl = $page.url.pathname;

	const navigationLinks = [
		{
			name: 'Panel',
			href: '/admin',
			icon: Dna
		},
		{
			name: 'Zamówienia',
			href: '/admin/zamowienia',
			icon: LayoutList
		},
		{
			name: 'Analityka',
			href: '/admin/analityka',
			icon: LineChart
		},
		{
			name: 'Produkty',
			href: '/admin/produkty',
			icon: List
		},
		{
			name: 'Użytkownicy',
			href: '/admin/uzytkownicy',
			icon: Users
		}
	];
</script>

<div class="h-full w-full">
	<nav class="tabs py-1">
		{#each navigationLinks as { name, href, icon: Icon }}
			<a {href} class="tab tab-lifted {activeUrl === href ? 'tab-active' : ''}"
				><Icon class="w-5 h-5 mr-2" />{name}</a
			>
		{/each}
	</nav>

	<slot />
</div>
