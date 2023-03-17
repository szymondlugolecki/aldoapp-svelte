<script lang="ts">
	import { X } from 'lucide-svelte';

	export let title: string;
</script>

<div class="flex justify-between items-center">
	<h3 class="text-xl font-medium p-0 text-base-content">{title}</h3>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<label
		tabindex="0"
		for="admin-drawer"
		class="btn btn-ghost rounded-full px-3"
		on:keypress={function (event) {
			if (event.key === 'Enter') {
				event.currentTarget.click();
			}
		}}><X /></label
	>
</div>
