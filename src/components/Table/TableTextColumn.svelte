<script lang="ts">
	export let textArray: string[];
</script>

<div class="flex flex-col items-start">
	{#each textArray as text}
		{#if text}
			<p>{text}</p>
		{:else}
			<br />
		{/if}
	{/each}
</div>
