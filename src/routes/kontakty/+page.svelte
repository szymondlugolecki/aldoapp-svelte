<script lang="ts">
	import { salesmenMenu } from '$lib/client/constants';
</script>

<section class="w-full flex flex-col items-center pb-44">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-8">Kontakty</h1>
	<div
		style="grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));"
		class="max-w-4xl grid gap-4 w-full px-8"
	>
		{#each salesmenMenu as element}
			<a
				href="/kontakty/{element.href}"
				class="rounded-lg border-border border p-4 flex flex-col gap-y-3"
			>
				<span class="text-2xl font-semibold tracking-tight">{element.name}</span>
				<p class="leading-7 text-sm">
					{element.description}
				</p>
			</a>
		{/each}
	</div>
</section>
