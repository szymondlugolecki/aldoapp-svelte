<script lang="ts">
	export let href: string;
	export let imgSrc: string;
	export let alt: string;
</script>

<a target="_blank" {href} class="aspect-3/4 w-fit">
	<img src={imgSrc} {alt} height="96px" width="72px" class="aspect-3/4" />
</a>
