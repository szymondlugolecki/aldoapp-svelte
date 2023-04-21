<script lang="ts">
	import { ArrowDownCircle } from 'lucide-svelte';
	export let rowId: string;
	export let extendRow: undefined | ((id: string) => void) = undefined;
</script>

<button
	on:click={() => {
		if (extendRow) extendRow(rowId);
	}}
	class="text-primary hover:text-primary-focus"><ArrowDownCircle /></button
>
