// import { p } from '$lib/server/clients/pClient';

import { db } from '$lib/server/db';

export const load = () => {
	return {
		products: db.query.products.findMany({
			with: {
				images: true
			},
			limit: 10,
			columns: {
				id: true,
				name: true,
				symbol: true,
				description: true,
				weight: true,
				price: true,
				category: true,
				subcategory: true,
				producent: true,
				encodedURL: true,
				amountLeft: true
			}
		})
	};
};
