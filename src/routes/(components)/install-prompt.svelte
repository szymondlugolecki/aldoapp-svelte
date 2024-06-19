<script lang="ts">
	import Button from '$components/ui/button/button.svelte';
	import { Download, Info, X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	export let deferredPrompt: BeforeInstallPromptEvent | undefined;
</script>

<div class="fixed md:bottom-0 md:top-auto bottom-auto top-[96px] z-50 w-full bg-popover">
	<div
		class="flex flex-col justify-between p-4 border-t shadow-lg gap-y-2 sm:flex-row border-border"
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center">
				<div class="flex items-center gap-x-2">
					<Info className="h-10 w-10 text-accent" />
					<div class="">
						<p class="text-sm">Możesz zainstalować aplikację Twoje ALDO na swoim urządzeniu.</p>
					</div>
				</div>
			</div>
		</div>

		<div class="flex gap-x-2">
			<Button
				size="sm"
				class="flex items-center h-8 gap-x-1"
				variant="secondary"
				on:click={() => (deferredPrompt = undefined)}
			>
				Nie chcę <X class="square-4" /></Button
			>
			<Button
				on:click={async () => {
					if (!deferredPrompt) {
						console.log('No deferred prompt');
						return toast.error('Nie można zainstalować aplikacji. Spróbuj ponownie');
					}
					await deferredPrompt.prompt();
					const { outcome } = await deferredPrompt.userChoice;
					if (outcome === 'accepted') {
						deferredPrompt = undefined;
					}
				}}
				size="sm"
				class="flex items-center h-8 gap-x-1">Zainstaluj <Download class="square-4" /></Button
			>
		</div>
	</div>
</div>
