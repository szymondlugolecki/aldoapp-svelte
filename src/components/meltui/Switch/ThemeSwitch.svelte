<script lang="ts">
	import { settings } from '$lib/client/stores/settings';
	import { createSwitch, melt } from '@melt-ui/svelte';

	export let defaultChecked: boolean;

	const {
		elements: { root, input },
		states: { checked }
	} = createSwitch({
		defaultChecked,
		onCheckedChange: (args) => {
			if (args.next === true) {
				$settings.theme = 'dark';
			} else {
				$settings.theme = 'light';
			}
			return args.next;
		}
	});
</script>

<button
	use:melt={$root}
	class="peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
>
	<span
		class="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0
                {$checked && 'translate-x-5'}"
	/>
	<input use:melt={$input} />
</button>
