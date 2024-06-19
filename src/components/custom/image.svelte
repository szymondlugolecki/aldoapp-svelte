<script lang="ts">
	type ImgProps = {
		src: string;
		w: number;
	};
	type ImgPropsH = ImgProps & { h: number };

	type ImgMeta = { img: ImgPropsH; sources: { [key: string]: ImgProps[] } };

	export let meta: Record<string, any>[];

	let metaFixed = meta as ImgMeta[];
	// if there is only one, vite-imagetools won't wrap the object in an array
	if (!(metaFixed instanceof Array)) metaFixed = [metaFixed];

	const sources = metaFixed[0].sources;
	const fallback = metaFixed[0].img;

	export let sizes = '100vw';
	export let alt = '';
	export let loading: 'lazy' | 'eager' | null | undefined = 'lazy';
	let className: string | undefined | null = undefined;

	export { className as class };
</script>

<!-- <div style={`max-width: ${fallback.w}px`}> -->
<picture>
	{#each Object.entries(sources) as [type, srcMeta]}
		<source
			type="image/{type}"
			{sizes}
			srcset={srcMeta.map((m) => `${m.src} ${m.w}w`).join(', ')}
		/>
	{/each}
	<img src={fallback.src} {alt} {loading} class={className} />
</picture>
<!-- </div> -->
