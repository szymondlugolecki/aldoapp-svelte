<script lang="ts">
	import type { ToastType } from 'svoast';

	// Default props from package:
	export let id: number;
	export let message: string;
	export let type: ToastType;
	export let duration: number;
	export let closable: boolean;
	export let infinite: boolean;

	console.log(id, message, type, duration, closable, infinite);
</script>

<div class="toast {type}" style="--duration: {duration}">
	<h1 class="text-black text-xl">POGGERS</h1>
	<p class="whitespace-pre-line">{message}</p>
</div>
