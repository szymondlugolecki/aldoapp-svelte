<script lang="ts">
	import { Separator } from '$shadcn/separator';
	import ThemeSwitch from '$meltui/Switch/ThemeSwitch.svelte';
	import SubscribeForm from './(components)/subscribe-form.svelte';
	import UnsubscribeForm from './(components)/unsubscribe-form.svelte';
	// import { getRegistration } from '$lib/client/functions/api/push';
	import { cn } from '$lib/utils';

	import { mode } from 'mode-watcher';
</script>

<!-- <SuperDebug data={data.unsubscribeForm} /> -->
<!-- <SuperDebug data={data.subscribeForm} /> -->

<div class="flex flex-col gap-y-6">
	<div>
		<h1 class="text-xl font-medium tracking-tight">Preferencje</h1>
		<p class="text-sm text-muted-foreground">Zmień motyw, zarządzaj powiadomieniami</p>
	</div>
	<Separator />
	<div class="grid grid-cols-2 gap-4">
		<div class="col-span-2 sm:col-span-1">
			<label
				for="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>Tryb ciemny</label
			>
			<p class="text-sm text-muted-foreground">
				Może zwiększyć komfort korzystania z aplikacji po zmroku
			</p>
		</div>
		<div class="sm:justify-self-end sm:place-self-center">
			<ThemeSwitch theme={$mode} />
		</div>
	</div>

	<Separator class="w-full" />

	<!-- <div class="grid grid-cols-2 gap-4">
		<div class="col-span-2 sm:col-span-1">
			<div class="flex items-center gap-x-2">
				<label
					for="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>Powiadomienia Push</label
				>
				<span
					class={cn(
						'square-3 rounded-full',
						subscriptionExists ? 'bg-green-500' : 'bg-red-500 animate-pulse'
					)}
				/>
			</div>
			<p class="text-sm text-muted-foreground">
				Powiadomienia na telefon o zmianach w statusie zamówienia, nowych promocjach, itp.
			</p>
		</div>
		<div class="sm:justify-self-end sm:place-self-center">
			<SubscribeForm {getSubscription} {subscriptionExists} form={data.subscribeForm} />
			<UnsubscribeForm {getSubscription} {subscriptionExists} form={data.unsubscribeForm} />
		</div>
	</div> -->
</div>
