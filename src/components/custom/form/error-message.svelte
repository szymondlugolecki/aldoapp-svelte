<script lang="ts">
	export let errors: string[] | undefined;
</script>

{#if errors && errors.length}
	<div class="py-1.5">
		<p class="text-sm text-destructive">{errors[0]}</p>
	</div>
{/if}
