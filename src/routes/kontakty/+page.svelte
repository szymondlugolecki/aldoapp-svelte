<script lang="ts">
	import { salesmenMenu } from '$lib/client/constants';
</script>

<section class="flex flex-col items-center w-full px-8 pb-44">
	<div class="my-8 text-center">
		<h1 class="my-4 text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl">Kontakty</h1>
		<p>Wybierz interesujący Cię dział.</p>
	</div>
	<div
		style="grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));"
		class="grid w-full max-w-4xl gap-4"
	>
		{#each salesmenMenu as element}
			<a
				href="/kontakty/{element.href}"
				class="flex flex-col p-4 transition-colors border rounded-lg border-border gap-y-3 hover:bg-foreground/5"
			>
				<span class="text-2xl font-semibold tracking-tight">{element.name}</span>
				<p class="text-sm leading-7">
					{element.description}
				</p>
			</a>
		{/each}
	</div>
</section>
