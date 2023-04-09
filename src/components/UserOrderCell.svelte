<script lang="ts">
	export let title: string;
	export let value: string | string[];
</script>

<div class="flex flex-col text-center shadow-md py-3 rounded-md justify-center break-words px-1">
	<span>{title}</span>
	{#if Array.isArray(value)}
		{#each value as val}
			<span class="text-base xs:text-xl font-bold">{val}</span>
		{/each}
	{:else}
		<span class="text-base xs:text-xl font-bold">{value}</span>
	{/if}
</div>
