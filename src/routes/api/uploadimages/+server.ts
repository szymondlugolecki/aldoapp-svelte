import { db } from '$lib/server/db/index.js';
import { productsTable, type SelectProduct } from '$lib/server/db/schemas/products.js';
import { json } from '@sveltejs/kit';

// import JPEG_ENC_WASM from '$lib/assets/codecs/mozjpeg_enc.wasm?url';

// import JPEG_DEC_WASM from '$lib/assets/codecs/mozjpeg_dec_codec.wasm?url';
// import AVIF_DEC_WASM from '$lib/assets/codecs/avif_dec.wasm?url';
// import JXL_DEC_WASM from '$lib/assets/codecs/jxl_dec.wasm?url';
// import PNG_DEC_WASM from '$lib/assets/codecs/squoosh_png_bg.wasm?url';
// import WEBP_DEC_WASM from '$lib/assets/codecs/webp_dec.wasm?url';

// import encode, { init as jpegEncInit } from '@jsquash/jpeg/encode';
// import decodeJpeg, { init as initDecJpeg } from '@jsquash/jpeg/decode';
// import decodeAvif, { init as initDecAvif } from '@jsquash/avif/decode';
// import decodeWebp, { init as initDecWebp } from '@jsquash/webp/decode';
// import decodeJpg, { init as initDecJpg } from '@jsquash/jxl/decode';
// import decodePng, { init as initDecPng } from '@jsquash/png/decode';

// import { trytm } from '@bdsqqq/try';
// import { utapi } from '$lib/server/clients/uploadthing';
// import type { BatchItem, BatchResponse } from 'drizzle-orm/batch';
// import { eq } from 'drizzle-orm';
// import resize from '@jsquash/resize';
// import Jimp from 'jimp';

// interface ProductWithImage extends SelectProduct {
// 	image: string;
// }

// type SvelteKitFetch = (
// 	input: URL | RequestInfo,
// 	init?: RequestInit | undefined
// ) => Promise<Response>;

// type ImageType = 'avif' | 'jpeg' | 'jpg' | 'png' | 'webp';

// const decode = async (image: Blob, fetch: SvelteKitFetch) => {
// 	const buffer = await image.arrayBuffer();
// 	const imageType = image.type.split('/')[1] as ImageType;

// 	console.log('imageType', imageType);

// 	switch (imageType) {
// 		case 'jpeg': {
// 			const wasmFile = await fetch(JPEG_DEC_WASM);
// 			const wasmArrayBuffer = await wasmFile.arrayBuffer();
// 			const wasmModule = new WebAssembly.Module(wasmArrayBuffer);

// 			await initDecJpeg(wasmModule);
// 			return decodeJpeg(buffer);
// 		}
// 		case 'avif': {
// 			const wasmFile = await fetch(AVIF_DEC_WASM);
// 			const wasmArrayBuffer = await wasmFile.arrayBuffer();
// 			const wasmModule = new WebAssembly.Module(wasmArrayBuffer);

// 			await initDecAvif(wasmModule);
// 			return decodeAvif(buffer);
// 		}
// 		case 'webp': {
// 			const wasmFile = await fetch(WEBP_DEC_WASM);
// 			const wasmArrayBuffer = await wasmFile.arrayBuffer();
// 			const wasmModule = new WebAssembly.Module(wasmArrayBuffer);

// 			await initDecWebp(wasmModule);
// 			return decodeWebp(buffer);
// 		}
// 		case 'jpg': {
// 			const wasmFile = await fetch(JXL_DEC_WASM);
// 			const wasmArrayBuffer = await wasmFile.arrayBuffer();
// 			const wasmModule = new WebAssembly.Module(wasmArrayBuffer);

// 			await initDecJpg(wasmModule);
// 			return decodeJpg(buffer);
// 		}
// 		case 'png': {
// 			const wasmFile = await fetch(PNG_DEC_WASM);
// 			const wasmArrayBuffer = await wasmFile.arrayBuffer();
// 			const wasmModule = new WebAssembly.Module(wasmArrayBuffer);

// 			await initDecPng(wasmModule);
// 			return decodePng(buffer);
// 		}

// 		default:
// 			break;
// 	}
// };

export const POST = async ({ fetch }) => {
	return json({ success: false, message: 'Not implemented' });
	/*const products = await db.query.productsTable.findMany({
		where: (products, { isNotNull }) => isNotNull(products.image),
		columns: {
			id: true,
			symbol: true
		}
	});

	if (!products) {
		return json({ success: false, message: 'No products with images found' });
	}

	const batchItems: BatchItem<'sqlite'>[] = [];

	console.log('products', products.length);

	const productsWithoutImages: number[] = [];

	for (let q = 0; q < products.length; q++) {
		const { id, symbol } = products[q];

		const linkWithoutExtension = `/pasze/${symbol}`;

		let extension: 'jpeg' | 'png' = 'jpeg';

		const jpgUrl = `${linkWithoutExtension}.jpg`;
		const pngUrl = `${linkWithoutExtension}.png`;

		let response: Response | undefined;
		// Fetch the image
		response = await fetch(jpgUrl);
		if (!response.ok) {
			response = await fetch(pngUrl);
			if (!response.ok) {
				console.error('No image found for', id);
				productsWithoutImages.push(id);
				continue;
			}
			extension = 'png';
		}

		const name = `product-${id}`;
		const type = 'image/' + extension;
		console.log('type', type);

		// const imageBlob = await response.blob();
		const image = new File([await response.arrayBuffer()], name);

		// Resize the image
		const arrBuffer = await image.arrayBuffer();
		const jimpImg = await Jimp.read(Buffer.from(arrBuffer));
		jimpImg.resize(500, 750);
		console.log('resizing', jimpImg.getMIME());
		const resizedImageBuffer = await jimpImg.getBufferAsync(jimpImg.getMIME());
		const imageResized = new File([resizedImageBuffer], name, { type: jimpImg.getMIME() });

		// Decode the image
		const imageData = await decode(imageResized, fetch);
		if (!imageData) {
			console.error('Failed to decode image', id);
			continue;
		}

		// Fetch encoding module
		const responseEnc = await fetch(JPEG_ENC_WASM);
		const wasmEncArrayBuffer = await responseEnc.arrayBuffer();
		const wasmEncModule = new WebAssembly.Module(wasmEncArrayBuffer);

		// Encode the image to JPEG
		await jpegEncInit(wasmEncModule);
		const compressedImageBuffer = await encode(imageData, { quality: 75 }); // jpeg

		// Create a new File instance from the compressed image buffer & upload it
		const newImage = new File([compressedImageBuffer], image.name);
		const { data, error } = await utapi.uploadFiles(newImage);

		if (error) {
			console.error('Failed to upload image', error, id);
			continue;
		}

		console.log('Uploaded', id);

		const query = db
			.update(productsTable)
			.set({
				image: data.url
			})
			.where(eq(productsTable.id, id));

		batchItems.push(query);
	}

	console.log('batchItems 1', batchItems.length);

	const [, editProductError1] = await trytm(
		db.batch(batchItems.splice(0, 23) as [BatchItem<'sqlite'>, ...BatchItem<'sqlite'>[]])
	);

	if (editProductError1) {
		console.error('editProductError1', editProductError1);
		return json({ success: false, message: 'Failed to compress all images 1' });
	}

	console.log('batchItems 2', batchItems.length);

	const [, editProductError2] = await trytm(
		db.batch(batchItems.splice(0, 23) as [BatchItem<'sqlite'>, ...BatchItem<'sqlite'>[]])
	);

	if (editProductError2) {
		console.error('editProductError2', editProductError2);
		return json({ success: false, message: 'Failed to compress all images 2' });
	}

	console.log('batchItems 3', batchItems.length);

	const [, editProductError3] = await trytm(
		db.batch(batchItems.splice(0, 33) as [BatchItem<'sqlite'>, ...BatchItem<'sqlite'>[]])
	);

	if (editProductError3) {
		console.error('editProductError3', editProductError3);
		return json({ success: false, message: 'Failed to compress all images 3' });
	}

	console.log('Success - compressed');

	return json({ success: true, message: 'Compressed' });

	*/
};
