import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { imagetools } from 'vite-imagetools';
// import fs from 'fs';
// import wasm from 'vite-plugin-wasm';
// import topLevelAwait from 'vite-plugin-top-level-await';

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
	assetsInclude: ['**/*.wasm', '**/*.wasm?url', '**/*.wasm?module'],
	optimizeDeps: {
		exclude: [
			'@jsquash/png',
			'@jsquash/jpeg',
			'@jsquash/avif',
			'@jsquash/webp',
			'@jsquash/jxl',
			'@syntect/wasm'
		]
	},
	plugins: [sveltekit(), imagetools()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts,wasm}']
	}
});
// wasm() , topLevelAwait()
