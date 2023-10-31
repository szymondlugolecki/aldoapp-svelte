<script lang="ts">
	export let required = true;
</script>

{#if required}
	<span class="text-destructive">*</span>
{/if}
