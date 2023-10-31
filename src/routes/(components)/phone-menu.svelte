<script lang="ts">
	import { cn } from '$lib/utils';
	import { Contact, ShoppingCart, Home } from 'lucide-svelte';
	import { page } from '$app/stores';
</script>

<nav
	class="fixed bottom-0 z-50 flex items-center w-screen gap-4 border-t justify-evenly md:hidden h-14 bg-background border-border"
>
	<a href="/" class={cn('transition-colors', $page.url.pathname === '/' && 'text-blue-600')}>
		<span class="sr-only">Strona główna</span>
		<Home class="w-6 h-6" />
	</a>
	<a
		href="/sklep"
		class={cn('transition-colors', $page.url.pathname === '/sklep' && 'text-blue-600')}
	>
		<span class="sr-only">Sklep</span>
		<ShoppingCart class="w-6 h-6" />
	</a>
	<a
		href="/kontakty"
		class={cn('transition-colors', $page.url.pathname.startsWith('/kontakty') && 'text-blue-600')}
	>
		<span class="sr-only">Kontakty</span>
		<Contact class="w-6 h-6" />
	</a>
</nav>
