<script lang="ts">
	import { ArrowUpDown } from 'lucide-svelte';
	export let sortable: boolean;
</script>

<div class="flex items-center rounded-lg w-full h-full">
	<slot />
	{#if sortable}
		<ArrowUpDown class="ml-1.5" size={20} />
	{/if}
</div>
