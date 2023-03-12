<script lang="ts">
	import { salesmenMenu } from '$lib/client/constants';
</script>

<div
	id="megamenu"
	class="border-base-content border mb-4 dropdown-content menu shadow bg-base-100 rounded-box w-[576px] -translate-x-1/2"
>
	<div class="mx-auto px-4 sm:px-3 lg:px-8">
		<div class="p-4 sm:px-2">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each salesmenMenu as element}
					<a
						href="/kontakty/{element.href}"
						class="rounded border-b border-gray-700 pb-4 px-2 duration-150 hover:bg-neutral-content hover:bg-opacity-5 py-1"
					>
						<h3 class="text-lg leading-6 font-medium text-base-content">{element.name}</h3>
						<p>{element.description}</p>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
