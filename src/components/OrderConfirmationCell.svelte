<script lang="ts">
	export let title: string;
	export let value: string;
</script>

<div class="flex flex-col space-y-1 justify-end shadow-sm py-1 pl-2">
	<span class="text-sm">{title}</span>
	<span class="text-sm xxs:text-base ss:text-lg font-bold">{value}</span>
</div>
