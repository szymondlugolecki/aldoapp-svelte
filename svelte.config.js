import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			'$server/env': './src/env/server.mjs',
			'$client/env': './src/env/client.mjs',
			'$components/*': 'src/components',
			$types: './src/types',
			$prisma: './src/lib/server/prismaClient.ts'
		}
	}
};

export default config;
