<script lang="ts">
	import type { MainCategory } from '$lib/client/constants/dbTypes';
	import { cn } from '$lib/client/functions';
	import { Beef, Dog, Egg, PiggyBank } from 'lucide-svelte';

	export let category: MainCategory;
	export let size: number | undefined = undefined;
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

{#if category === 'trzoda'}
	<PiggyBank {size} class={cn(className)} />
{:else if category === 'bydlo'}
	<Beef {size} class={cn(className)} />
	<!-- <svg
		width={size}
		height={size}
		class={cn('text-white', className)}
		fill='none'
		stroke='currentColor'
		stroke-width={2}
		stroke-linecap='round'
		stroke-linejoin='round'
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		><g
			><path
				d="M19.37 6h-6.78a4.34 4.34 0 0 0-1.74-.91c-.16-.26-.33-.57-.5-.86a6.6 6.6 0 0 0 .27-1.73 1 1 0 0 0-2 0 3.4 3.4 0 0 1-.09.75H5.72a3.44 3.44 0 0 1-.1-.75 1 1 0 0 0-2 0 7.21 7.21 0 0 0 .27 1.74l-.49.85a4.24 4.24 0 0 0-2.65 2 3.76 3.76 0 0 0-.21 3.67A2.4 2.4 0 0 0 2.62 12L3 12l.49 1.47a3 3 0 0 0 2.86 2.03h.52v6a1 1 0 0 0 1 1h2.75a1 1 0 0 0 1-.82l.83-4.55a4.9 4.9 0 0 0 2 1.49l-.22.64a.75.75 0 0 0 1.43.48l.25-.76.58 0 .24.74a.77.77 0 0 0 .95.47.75.75 0 0 0 .48-.95l-.16-.46a3.71 3.71 0 0 0 .72-.3l.72 3.24a1 1 0 0 0 1 .78h2a1 1 0 0 0 1-.9s.47-10.23.47-10.87A4.79 4.79 0 0 0 19.37 6Zm-14 6.81L4.44 10a.5.5 0 0 0-.72-.28 2.35 2.35 0 0 1-1.1.33c-.93 0-.55-3 1.94-3h.05c.12-.17.48-.78.74-1.23l.14 0A1 1 0 0 0 6 5.25h2.26a1 1 0 0 0 .49.43l.15 0c.26.45.62 1.06.74 1.23C12.18 7 12.56 10 11.62 10a2.32 2.32 0 0 1-1.09-.33.5.5 0 0 0-.72.28l-1 2.86a1 1 0 0 1-.95.69H6.35a1 1 0 0 1-.95-.69Zm16.09 7.69h-.28l-.83-3.72a1 1 0 0 0-1-.78h-.5a.91.91 0 0 0-.86.5s-.36.5-1.64.5a3 3 0 0 1-2.6-1.45 1 1 0 0 0-.9-.55h-1.23a1 1 0 0 0-1 .82l-.83 4.68h-.92v-5.16a3 3 0 0 0 1.88-1.89l.49-1.45.38 0a2.56 2.56 0 0 0 2.47-2.75 4.13 4.13 0 0 0-.2-1.25h1.31a3 3 0 0 0 1.42 3.08.81.81 0 0 0 .27.11l2.66.64.16.65A2 2 0 0 0 21.8 14c-.08 2.94-.24 5.29-.34 6.5Z"
			/><path d="M7.87 8a.75.75 0 1 0 1.5 0 .75.75 0 1 0-1.5 0" /><path
				d="M4.87 8a.75.75 0 1 0 1.5 0 .75.75 0 1 0-1.5 0"
			/></g
		></svg
	> -->
{:else if category === 'drob'}
	<Egg {size} class={cn(className)} />

	<!-- <svg
		width={size}
		height={size}
		class={cn('text-white', className)}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		><g
			><g
				><path
					d="M13.8 6a.52.52 0 0 0 .4 0 1 1 0 0 0 .8-.8.52.52 0 0 0 0-.4 1 1 0 0 0-.8-.8.52.52 0 0 0-.4 0 1 1 0 0 0-.8.8.52.52 0 0 0 0 .4 1 1 0 0 0 .8.8Z"
					fill="currentColor"
				/><path
					d="M6.37 10.67a.52.52 0 0 0 .18-.32 6.25 6.25 0 0 1 2.5-4 1 1 0 0 0 .45-.85A3.5 3.5 0 0 1 13 2c1.74 0 3.5.93 3.5 3v2.5a1.19 1.19 0 0 0 .05.32c.16.47.52 1.62.75 2.58l1 .83a.5.5 0 0 0 .61 0l.27-.2a.51.51 0 0 0 .21-.5c-.12-.59-.31-1.3-.49-1.92a.53.53 0 0 1 .1-.41.49.49 0 0 1 .4-.2h.6a.5.5 0 0 0 .5-.5 3 3 0 0 0-1.77-2.72.49.49 0 0 1-.29-.4C18.13 1.81 16 0 13 0a5.5 5.5 0 0 0-5.45 4.78.49.49 0 0 1-.18.32 7.9 7.9 0 0 0-2.85 5.74l.57.41a.51.51 0 0 0 .61 0Z"
					fill="currentColor"
				/></g
			><path
				d="M12 24A10.62 10.62 0 0 1 1.39 13.39c0-.66 0-1.31.08-1.93A.5.5 0 0 1 2 11c.18 0 .19 0 3.19 2.14a.48.48 0 0 0 .61 0l2.41-2a.5.5 0 0 1 .61 0l2.92 2.09a.51.51 0 0 0 .58 0l2.92-2.09a.5.5 0 0 1 .61 0l2.41 2a.5.5 0 0 0 .61 0l2.9-2.06a.5.5 0 0 1 .5 0 .49.49 0 0 1 .29.41c0 .62.08 1.27.08 1.93A10.62 10.62 0 0 1 12 24Z"
				fill="currentColor"
			/></g
		></svg
	> -->
{:else if category === 'hodowla-przydomowa'}
	<Dog {size} class={cn(className)} />
{/if}
