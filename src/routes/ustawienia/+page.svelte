<script lang="ts">
	import * as Form from '$shadcn/form';
	import { settings$ } from '$lib/client/schemas/index.js';
	import { Separator } from '$shadcn/separator';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	import MessageAlert from '$components/custom/Form/MessageAlert.svelte';
	import AddressForm from './(components)/address-form.svelte';
	import PhoneForm from './(components)/phone-form.svelte';
	import EmailForm from './(components)/email-form.svelte';

	// export let data;
</script>

<svelte:head>
	<title>Ustawienia • Twoje ALDO</title>
	<meta name="description" content="Ustawienia. Włącz powiadomienia. Zmień motyw." />
</svelte:head>

<div class="flex flex-col gap-y-6">
	<!-- <div>
		<h1 class="text-xl font-medium tracking-tight">Profil</h1>
		<p class="text-sm text-muted-foreground">
			Zmodyfikuj swój adres email, domyślny adres dostawy i numer telefonu
		</p>
	</div> -->
	<!-- <Separator />
	<AddressForm form={data.addressForm} />
	<Separator />
	<EmailForm form={data.emailForm} />
	<Separator />
	<PhoneForm form={data.phoneForm} /> -->
</div>
