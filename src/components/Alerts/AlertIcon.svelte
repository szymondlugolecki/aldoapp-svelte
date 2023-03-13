<script lang="ts">
	import { Check, XCircle, AlertTriangle, Info } from 'lucide-svelte';

	export let type: 'success' | 'error' | 'warning' | 'info';
</script>

{#if type === 'success'}
	<Check />
{:else if type === 'error'}
	<XCircle />
{:else if type === 'warning'}
	<AlertTriangle />
{:else if type === 'info'}
	<Info />
{/if}
