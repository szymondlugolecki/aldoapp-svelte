import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
// import { imagetools } from '@zerodevx/svelte-img/vite';
// import fs from 'fs';

export default defineConfig({
	define: {
		'process.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString())
	},
	// server: {
	// 	// proxy: {},
	// 	https:
	// 		process.env.NODE_ENV === 'development'
	// 			? {
	// 					key: fs.readFileSync('certs/localhost-key.pem'),
	// 					cert: fs.readFileSync('certs/localhost.pem')
	// 			  }
	// 			: undefined
	// },
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
