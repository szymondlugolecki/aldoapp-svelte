import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vitest/config';
import { imagetools } from '@zerodevx/svelte-img/vite';

export default defineConfig({
	define: {
		'process.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString())
	},
	plugins: [sveltekit(), SvelteKitPWA(), imagetools()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
