<script lang="ts">
	import { salesmenMenu } from '$lib/client/constants';
	import { fly } from 'svelte/transition';
</script>

<div
	id="megamenu"
	class="border-base-content border mb-4 dropdown-content menu shadow bg-background rounded-box w-[576px] -translate-x-1/2"
>
	<div class="mx-auto px-4 sm:px-3 lg:px-8">
		<div class="p-4 sm:px-2">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each salesmenMenu as element}
					<a
						href="/kontakty/{element.href}"
						class="text-base-content rounded border-b border-gray-700 pb-4 px-2 duration-150 hover:bg-primary-focus py-1 hover:bg-opacity-20"
					>
						<h3 class="text-lg leading-6 font-medium">{element.name}</h3>
						<p>{element.description}</p>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
