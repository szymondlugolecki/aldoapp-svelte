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

<div class="h-full">
	<nav class="border-b border-gray-200 dark:border-gray-700">
		<ul
			class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400"
		>
			{#each navigationLinks as { name, href, icon: Icon }}
				<li class="mr-2">
					<a
						{href}
						class={`inline-flex p-4 border-b-2 border-transparent rounded-t-lg ${
							activeUrl === href ? 'text-blue-700' : 'text-black'
						} group`}
					>
						<Icon class="w-5 h-5 mr-2" />
						{name}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<slot />
</div>
