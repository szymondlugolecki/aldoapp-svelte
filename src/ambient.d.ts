declare module '$lib/assets/*.[png|jpg|jpeg|webp|avif]' {
	const image: Record<string, any>[];
	export default image;
}
