<script lang="ts">
	import { serializeSchema } from '$lib/client/functions';

	export let schema: import('$lib/client/functions').Schema;
</script>

<svelte:head>
	{@html serializeSchema(schema)}
</svelte:head>
