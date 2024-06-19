<script lang="ts">
	export let message: string | undefined;
</script>

{#if message}
	<div class="py-1.5">
		<p class="text-sm text-green-500/70">{message}</p>
	</div>
{/if}
