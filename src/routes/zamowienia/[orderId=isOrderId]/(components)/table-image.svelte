<script lang="ts">
	export let href: string;
	export let alt: string;
	export let image: string;
</script>

<div class="w-32 overflow-hidden aspect-2/3">
	<a {href}
		><img src={image} {alt} class="object-cover object-center w-full h-full rounded-md" />
	</a>
</div>
