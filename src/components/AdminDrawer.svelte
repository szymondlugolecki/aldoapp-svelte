<script lang="ts">
	import { drawer } from '$lib/client/stores/adminDrawer';

	let adminDrawerLabel: HTMLLabelElement;

	drawer.subscribe((value) => {
		if (value && adminDrawerLabel) {
			adminDrawerLabel.click();
		}
	});
</script>

<input type="checkbox" name="admin-drawer" id="admin-drawer" class="modal-toggle" />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<label
	for="admin-drawer"
	class="modal modal-bottom sm:modal-middle cursor-pointer"
	bind:this={adminDrawerLabel}
>
	<label for="" class="modal-box relative p-5 xs:p-6">
		<slot />
	</label>
</label>
