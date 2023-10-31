<script lang="ts">
	import ErrorMessage from './ErrorMessage.svelte';
	import Message from '$components/custom/Form/Message.svelte';

	export let message: string | undefined;
	export let timeout: boolean;
</script>

{#if message}
	<Message {message} />
{/if}
{#if timeout}
	<ErrorMessage errors={['To zajmuje wyjątkowo długo']} />
{/if}
