import { sveltekit } from '@sveltejs/kit/vite';
// import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vitest/config';
import { imagetools } from '@zerodevx/svelte-img/vite';

export default defineConfig({
	define: {
		'process.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString())
	},
	plugins: [
		sveltekit(),
		// SvelteKitPWA(),
		// {
		// 	srcDir: './src',
		// 	mode: 'development',
		// 	strategies: 'injectManifest',
		// 	filename: 'prompt-sw.ts',
		// 	scope: '/',
		// 	base: '/',
		// 	injectManifest: {
		// 		globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
		// 	},
		// 	devOptions: {
		// 		enabled: true,
		// 		type: 'module',
		// 		navigateFallback: '/'
		// 	},
		// 	manifest: {
		// 		lang: 'pl',
		// 		name: 'Twoje ALDO',
		// 		short_name: 'Twoje ALDO',
		// 		description:
		// 			'Sklep internetowy ALDO. Zamawiaj gdziekolwiek jesteś, otrzymuj w dowolnym miejscu. Znajdź numery do sprzedawców.',
		// 		start_url: '/',
		// 		scope: '/',
		// 		display: 'standalone',
		// 		theme_color: '#ffffff',
		// 		background_color: '#ffffff',
		// 		icons: [
		// 			{
		// 				src: '/pwa-192x192.png',
		// 				sizes: '192x192',
		// 				type: 'image/png'
		// 			},
		// 			{
		// 				src: '/pwa-512x512.png',
		// 				sizes: '512x512',
		// 				type: 'image/png'
		// 			},
		// 			{
		// 				src: '/pwa-512x512.png',
		// 				sizes: '512x512',
		// 				type: 'image/png',
		// 				purpose: 'any maskable'
		// 			}
		// 		]
		// 	}
		// }
		imagetools()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
