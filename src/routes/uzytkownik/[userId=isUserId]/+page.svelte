<script lang="ts">
	import Alert from '$components/Alerts/Alert.svelte';
	import { orderStatusList } from '$lib/client/constants/index.js';
	import { dateParser } from '$lib/client/functions/index.js';
	import { onMount } from 'svelte';
	import type { Order } from '$types';

	export let data;
</script>

<svelte:head>
	<title>{data.user.fullName} • Twoje ALDO</title>
	<meta name="description" content="Profil użytkownika {data.user.fullName}" />
</svelte:head>

<span>profil uzytkownika {data.user.fullName}</span>
