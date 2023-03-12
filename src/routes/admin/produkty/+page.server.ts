import { prisma } from '$lib/server/clients/prismaClient';

import add from '$lib/server/actions/product/add';
import edit from '$lib/server/actions/product/edit';
import remove from '$lib/server/actions/product/remove';

export const load = () => {
	return {
		products: prisma.product.findMany({
			include: {
				author: {
					select: {
						id: true,
						fullName: true,
						email: true
					}
				},
				images: {
					select: {
						url: true
					}
				}
			}
		})
	};
};

// const createThumbnailFileName = (thumbnail: File) => {
// 	const fileNameId = createId();
// 	const fileFormat = thumbnail.type.split('/')[1];
// 	const fullFile = `${fileNameId}.${fileFormat}`;

// 	return fullFile;
// };

export const actions = {
	add,
	edit,
	remove
};
