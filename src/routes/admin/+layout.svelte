<script lang="ts">
	import { LayoutDashboard } from 'lucide-svelte';
	import { page } from '$app/stores';
	$: activeUrl = $page.url.pathname;

	const navigationLinks = [
		{
			name: 'Panel',
			href: '/admin'
		},
		{
			name: 'Produkty',
			href: '/admin/produkty'
		},
		{
			name: 'Analityka',
			href: '/admin/analityka'
		},
		{
			name: 'Użytkownicy',
			href: '/admin/uzytkownicy'
		}
	];

	// {#each navigationLinks as link}
	// 	<a
	// 		class={`text-center ${activeUrl === link.href ? 'text-blue-700' : 'text-black'}`}
	// 		href={link.href}>{link.name}</a
	// 	>
	// {/each}

	// hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300
</script>

<div class="px-3">
	<nav class="border-b border-gray-200 dark:border-gray-700">
		<ul
			class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400"
		>
			{#each navigationLinks as link}
				<li class="mr-2">
					<a
						href={link.href}
						class={`inline-flex p-4 border-b-2 border-transparent rounded-t-lg ${
							activeUrl === link.href ? 'text-blue-700' : 'text-black'
						} group`}
					>
						<LayoutDashboard class="w-5 h-5 mr-2" />
						{link.name}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<slot />
</div>
