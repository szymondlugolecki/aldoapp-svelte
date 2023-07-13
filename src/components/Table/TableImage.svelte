<script lang="ts">
	export let href: string;
	export let imgSrc: string;
	export let alt: string;
</script>

<a target="_blank" {href}>
	<img src={imgSrc} {alt} height="96px" width="72px" />
</a>
