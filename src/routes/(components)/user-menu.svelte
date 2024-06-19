<script lang="ts">
	import { isAtLeastModerator } from '$lib/client/functions';
	import { Separator } from '$shadcn/separator';
	import type { SessionUser } from '$types';
	import { createPopover, melt } from '@melt-ui/svelte';
	import { Lock, LogOut, Settings, User, X } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { invalidate, invalidateAll } from '$app/navigation';
	import { trytm } from '@bdsqqq/try';
	import { toast } from 'svelte-sonner';
	import Spinner from '$components/custom/spinner.svelte';

	export let user: SessionUser;

	let loggingOut = false;

	const logout = async () => {
		console.log('logout');
		loggingOut = true;
		const [, logoutError] = await trytm(
			fetch('/api/logout', {
				method: 'POST',
				credentials: 'include'
			})
		);
		loggingOut = false;

		if (logoutError) {
			toast.error('Błąd podczas wylogowywania');
			return;
		}

		await invalidateAll();
		toast('Wylogowano pomyślnie');
	};

	const {
		elements: { trigger, content, arrow, close },
		states: { open }
	} = createPopover({
		forceVisible: false
		// disableFocusTrap: true,
	});
</script>

<button type="button" class="trigger" use:melt={$trigger} aria-label="Menu użytkownika">
	<User />
	<span class="sr-only">Menu użytkownika</span>
</button>

{#if $open}
	<div
		use:melt={$content}
		transition:fade={{ duration: 100 }}
		class="z-50 w-[232px] rounded-sm p-5 shadow-sm"
	>
		<div use:melt={$arrow} />
		<div class="flex flex-col gap-1 p-3 border rounded-lg bg-background border-border">
			<div class="flex flex-col truncate max-w-[146px] text-sm">
				<!-- <span class="rounded-full text-xs bg-red-500 w-fit px-2 py-0.5">{roleNames[user.role]}</span
				> -->
				<span>{user.fullName}</span>
				<Separator class="mt-2" />
			</div>

			{#if isAtLeastModerator(user.role)}
				<button use:melt={$close} class="">
					<a
						href="/admin"
						class="flex gap-2 items-center hover:bg-muted px-2 py-1.5 rounded-lg text-sm text-left"
						><Lock class="square-5" /> Panel administracyjny
					</a>
				</button>
			{/if}
			<button use:melt={$close} class="">
				<a
					href="/uzytkownik/ja"
					class="flex gap-2 items-center hover:bg-muted px-2 py-2.5 rounded-lg text-sm"
					><User class="square-5" /> Mój profil
				</a>
			</button>
			<button use:melt={$close} class="">
				<a
					href="/ustawienia/preferencje"
					class="flex gap-2 items-center hover:bg-muted px-2 py-2.5 rounded-lg text-sm"
					><Settings class="square-5" />Ustawienia</a
				>
			</button>

			<button
				disabled={loggingOut}
				class="flex gap-2 items-center hover:bg-muted px-2 py-2.5 rounded-lg text-destructive text-sm"
				on:click={() => logout()}
			>
				{#if loggingOut}
					<Spinner />
				{:else}
					<LogOut class="square-5" />Wyloguj
				{/if}
			</button>
		</div>
		<button class="absolute right-8 top-8" use:melt={$close}>
			<X class="square-4" />
		</button>
	</div>
{/if}
