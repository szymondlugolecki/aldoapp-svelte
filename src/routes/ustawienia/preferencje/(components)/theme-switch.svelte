<script lang="ts">
	import { Switch } from '$shadcn/switch';
	import { setMode } from 'mode-watcher';

	export let theme: 'dark' | 'light' | undefined;
</script>

<Switch
	id="theme-switch"
	checked={theme === 'dark'}
	onCheckedChange={(checked) => {
		if (checked) {
			setMode('dark');
		} else {
			setMode('light');
		}
	}}
/>
