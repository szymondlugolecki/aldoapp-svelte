<script lang="ts">
	export let errors: string[] | undefined;
</script>

{#if errors}
	<span class="text-sm tracking-tight text-red-400">
		• {errors.join('\n• ')}
	</span>
{/if}
