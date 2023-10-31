<script lang="ts">
	import { getForm } from 'formsnap';
	const { message } = getForm();
</script>

{#if $message}
	<div class="py-1.5">
		<p class="text-sm text-green-500/70">{$message}</p>
	</div>
{/if}
