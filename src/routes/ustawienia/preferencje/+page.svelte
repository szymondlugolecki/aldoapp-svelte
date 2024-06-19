<script lang="ts">
	import { Separator } from '$shadcn/separator';
	import ThemeSwitch from './(components)/theme-switch.svelte';

	import { mode } from 'mode-watcher';
</script>

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
</div>
