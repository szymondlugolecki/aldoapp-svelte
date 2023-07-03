<script lang="ts">
	import { flyAndScale } from '$lib/client/functions';
	import type { createDialog } from '@melt-ui/svelte';
	import { X } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import type { Writable } from 'svelte/store';

	export let content: ReturnType<typeof createDialog>['content'];
	export let close: ReturnType<typeof createDialog>['close'];
	export let portal: ReturnType<typeof createDialog>['portal'];
	export let overlay: ReturnType<typeof createDialog>['overlay'];
	export let open: Writable<boolean>;
</script>

<div use:portal>
	{#if $open}
		<div
			{...$overlay}
			class="fixed inset-0 z-20 bg-background/90"
			transition:fade|local={{ duration: 150 }}
		/>
		<div
			class="fixed left-[50%] top-[50%] z-30 max-h-[85vh] w-[90vw] max-w-[450px]
            translate-x-[-50%] translate-y-[-50%] rounded-md p-[20px] xxs:p-[25px]
            shadow-lg bg-background border border-border"
			transition:flyAndScale|local={{ duration: 150, y: 8, start: 0.96 }}
			{...$content}
			use:content.action
		>
			<slot />

			<button
				{...close}
				use:close.action
				class="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full
            hover:bg-magnum-100 focus:shadow-magnum-400"
			>
				<X />
			</button>
		</div>
	{/if}
</div>
