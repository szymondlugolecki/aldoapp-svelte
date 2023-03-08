import { prisma } from '$prisma';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	const products = await prisma.product.findMany({
		select: {
			id: true,
			name: true,
			symbol: true,
			thumbnail: true,
			description: true,
			images: true
		}
	});
	console.table(products.map((u) => [u.name, u.symbol]));

	return { products };
}) satisfies LayoutServerLoad;
