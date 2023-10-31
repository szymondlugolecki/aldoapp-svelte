<script lang="ts">
	import { melt, type createDialog } from '@melt-ui/svelte';
	import { X } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import type { Writable } from 'svelte/store';
	import flyAndScale from '$lib/client/transitions';

	export let content: ReturnType<typeof createDialog>['elements']['content'];
	export let close: ReturnType<typeof createDialog>['elements']['close'];
	export let portalled: ReturnType<typeof createDialog>['elements']['portalled'];
	export let overlay: ReturnType<typeof createDialog>['elements']['overlay'];
	export let open: Writable<boolean>;
</script>

<div use:melt={$portalled}>
	{#if $open}
		<div
			use:melt={$overlay}
			class="fixed inset-0 z-20 bg-background/90"
			transition:fade={{ duration: 150 }}
		/>
		<div
			class="fixed left-[50%] top-[50%] z-40 max-h-[85vh] w-[90vw] max-w-[450px]
            translate-x-[-50%] translate-y-[-50%] rounded-md p-[20px] xxs:p-[25px]
            shadow-lg bg-background border border-border"
			transition:flyAndScale={{ duration: 150, y: 8, start: 0.96 }}
			use:melt={$content}
		>
			<slot />

			<button
				use:melt={$close}
				class="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full
            hover:bg-magnum-100 focus:shadow-magnum-400"
			>
				<X />
			</button>
		</div>
	{/if}
</div>
