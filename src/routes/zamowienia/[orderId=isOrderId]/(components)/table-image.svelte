<script lang="ts">
	export let href: string;
	export let alt: string;

	const productImgUrl =
		'https://res.cloudinary.com/dzcuq1b2u/image/upload/v1680687127/products/Lacto%20Start%20IPC%20pasza%20rozdojeniowa%20De%20Heus%2025kg/DB4A2X00G-W00/0.webp';
</script>

<div class="w-32 overflow-hidden aspect-2/3">
	<a {href}
		><img src={productImgUrl} {alt} class="object-cover object-center w-full h-full scale-[1.17]" />
	</a>
</div>
