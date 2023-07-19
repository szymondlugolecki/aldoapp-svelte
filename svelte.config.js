import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors

	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			runtime: 'edge',
			external: ['crypto']
		}),
		alias: {
			'$components/*': 'src/components',
			$types: './src/types',
			'$shadcn/*': 'src/lib/components/ui/*',
			'$meltui/*': 'src/lib/components/meltui/*'
		}
	},
	shadcn: {
		componentPath: './src/lib/components/ui'
	}
};
export default config;
