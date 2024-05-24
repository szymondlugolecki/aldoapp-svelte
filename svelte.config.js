import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { preprocessMeltUI } from '@melt-ui/pp'
import sequence from 'svelte-sequential-preprocessor'

/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors

	preprocess: sequence([
		// ... other preprocessors
		vitePreprocess(),
		preprocessMeltUI() // add to the end!
	  ]),
	kit: {
		adapter: adapter({
			runtime: 'edge',
			regions: ['fra1'],
			// external: ['@jsquash/jpeg', '@jsquash/avif', '@jsquash/webp', '@jsquash/jxl', '@jsquash/png']
		}),
		alias: {
			'$components/*': 'src/components/*',
			'$shadcn/*': 'src/components/ui/*',
			'$meltui/*': 'src/components/meltui/*',
			'$types': './src/types',
			'$routes': './src/routes',
		},
	},
};
export default config;
