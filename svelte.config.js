import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

// import { p } from './src/lib/server/clients/pClient';

// const getProductsNames = async () => {
// 	const products = await p.product
// 		.findMany({
// 			select: {
// 				name: true
// 			}
// 		})
// 		.map((product) => encodeURIComponent(product.name));

// 	return products;
// };

const shortServices = ['pasze', 'komis', 'market', 'paliwa', 'maszyny', 'serwis'];

// console.log(shortServices.map((service) => `/kontakty/${service}`));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			runtime: 'nodejs18.x'
		}),
		// serviceWorker: {
		// 	register: false
		// },
		alias: {
			'$components/*': 'src/components',
			$types: './src/types',
			$prisma: './src/lib/server/prismaClient.ts'
		},
		prerender: {
			entries: [
				...shortServices.map((service) => `/kontakty/${service}`)
				// ...(await getProductsNames())
			]
		}
	}
};

export default config;
