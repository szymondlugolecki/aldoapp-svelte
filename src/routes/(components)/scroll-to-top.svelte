<script lang="ts">
	import { ArrowUp } from 'radix-icons-svelte';
	import { fade } from 'svelte/transition';
</script>

<a
	transition:fade={{
		duration: 300,
		delay: 0
	}}
	class="fixed inline-flex items-center justify-center text-sm rounded-full shadow bg-primary bottom-20 md:bottom-4 right-4 square-12 sm:square-14 text-primary-foreground hover:bg-primary/90"
	href="#top"
>
	<ArrowUp size={24} />
</a>
