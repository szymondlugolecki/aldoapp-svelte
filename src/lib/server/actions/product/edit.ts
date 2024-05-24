// import { p } from '$lib/server/clients/pClient';
import { error, type Action, redirect } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import getCustomError from '$lib/client/constants/customErrors';
import { isAtLeastModerator } from '$lib/client/functions';
import { products$ } from '$lib/client/schemas';
import { setError, setMessage, superValidate, fail } from 'sveltekit-superforms';
import { productsTable, type SelectProduct } from '$lib/server/db/schemas/products';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { put } from '@vercel/blob';
import { env } from '$env/dynamic/private';
import { zod } from 'sveltekit-superforms/adapters';
import { utapi } from '$lib/server/clients/uploadthing';

import JPEG_ENC_WASM from '@jsquash/jpeg/codec/enc/mozjpeg_enc.wasm?url';

import JPEG_DEC_WASM from '@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm?url';
import AVIF_DEC_WASM from '@jsquash/avif/codec/dec/avif_dec.wasm?url';
import JXL_DEC_WASM from '@jsquash/jxl/codec/dec/jxl_dec.wasm?url';
import PNG_DEC_WASM from '@jsquash/png/codec/pkg/squoosh_png_bg.wasm?url';
import WEBP_DEC_WASM from '@jsquash/webp/codec/dec/webp_dec.wasm?url';

import encode, { init as jpegEncInit } from '@jsquash/jpeg/encode';
import decodeJpeg, { init as initDecJpeg } from '@jsquash/jpeg/decode';
import decodeAvif, { init as initDecAvif } from '@jsquash/avif/decode';
import decodeWebp, { init as initDecWebp } from '@jsquash/webp/decode';
import decodeJpg, { init as initDecJpg } from '@jsquash/jxl/decode';
import decodePng, { init as initDecPng } from '@jsquash/png/decode';

import Jimp from 'jimp';

type ImageType = 'avif' | 'jpeg' | 'jpg' | 'png' | 'webp';
type SvelteKitFetch = (
	input: URL | RequestInfo,
	init?: RequestInit | undefined
) => Promise<Response>;

const decode = async (image: Blob, fetch: SvelteKitFetch) => {
	const buffer = await image.arrayBuffer();
	const imageType = image.type.split('/')[1] as ImageType;

	switch (imageType) {
		case 'jpeg': {
			const wasmFile = await fetch(JPEG_DEC_WASM);
			const wasmArrayBuffer = await wasmFile.arrayBuffer();
			const wasmModule = new WebAssembly.Module(wasmArrayBuffer);

			await initDecJpeg(wasmModule);
			return decodeJpeg(buffer);
		}
		case 'avif': {
			const wasmFile = await fetch(AVIF_DEC_WASM);
			const wasmArrayBuffer = await wasmFile.arrayBuffer();
			const wasmModule = new WebAssembly.Module(wasmArrayBuffer);

			await initDecAvif(wasmModule);
			return decodeAvif(buffer);
		}
		case 'webp': {
			const wasmFile = await fetch(WEBP_DEC_WASM);
			const wasmArrayBuffer = await wasmFile.arrayBuffer();
			const wasmModule = new WebAssembly.Module(wasmArrayBuffer);

			await initDecWebp(wasmModule);
			return decodeWebp(buffer);
		}
		case 'jpg': {
			const wasmFile = await fetch(JXL_DEC_WASM);
			const wasmArrayBuffer = await wasmFile.arrayBuffer();
			const wasmModule = new WebAssembly.Module(wasmArrayBuffer);

			await initDecJpg(wasmModule);
			return decodeJpg(buffer);
		}
		case 'png': {
			const wasmFile = await fetch(PNG_DEC_WASM);
			const wasmArrayBuffer = await wasmFile.arrayBuffer();
			const wasmModule = new WebAssembly.Module(wasmArrayBuffer);

			await initDecPng(wasmModule);
			return decodePng(buffer);
		}

		default:
			break;
	}
};

const edit: Action = async ({ request, locals, fetch }) => {
	const sessionUser = locals.user;
	// Must be a moderator or higher
	if (!sessionUser) {
		redirect(303, '/zaloguj');
		// error(...getCustomError('not-logged-in'));;
	}

	if (!isAtLeastModerator(sessionUser.role)) {
		error(...getCustomError('insufficient-permissions'));
	}

	const formData = await request.formData();
	const form = await superValidate(formData, zod(products$.editForm));

	if (!form.valid) return fail(400, { form });

	// Make sure something else other than id was provided
	if (Object.keys(form.data).length <= 1) {
		return setError(form, 'Nie podano żadnych danych do edycji', { status: 400 });
	}

	const {
		id,
		name,
		symbol,
		category,
		subcategory,
		price,
		producent,
		weight,
		description,
		hidden,
		images
	} = form.data;

	let imageUrl: string | null = null;

	// We're handling only one image at once for now
	const image = images;

	if (image) {
		// One image per product is enough for now
		// Uploadthing
		try {
			// Resize the image
			const arrBuffer = await image.arrayBuffer();
			const jimpImg = await Jimp.read(Buffer.from(arrBuffer));
			jimpImg.resize(500, 750);
			const resizedImageBuffer = await jimpImg.getBufferAsync(jimpImg.getMIME());
			const imageResized = new File([resizedImageBuffer], image.name, { type: jimpImg.getMIME() });

			// Decode the image
			const imageData = await decode(imageResized, fetch);
			if (!imageData) {
				throw new Error('No image data');
			}

			// Fetch encoding module
			const responseEnc = await fetch(JPEG_ENC_WASM);
			const wasmEncArrayBuffer = await responseEnc.arrayBuffer();
			const wasmEncModule = new WebAssembly.Module(wasmEncArrayBuffer);

			// Encode the image to JPEG
			await jpegEncInit(wasmEncModule);
			const compressedImageBuffer = await encode(imageData, { quality: 75 }); // jpeg

			// Create a new File from the compressed image buffer & upload it
			const newFile = new File([compressedImageBuffer], image.name);
			const { data, error } = await utapi.uploadFiles(newFile);

			if (error) {
				throw error;
			}

			console.log('data', data);
			imageUrl = data.url;
		} catch (error) {
			// Unexpected-error
			console.error('addProductImageError', error);
			return setError(form, 'Błąd serwera podczas dodawania zdjęcia', { status: 500 });
		}
	}

	const newProduct: Partial<
		Pick<
			SelectProduct,
			| 'name'
			| 'symbol'
			| 'category'
			| 'subcategory'
			| 'price'
			| 'producent'
			| 'weight'
			| 'description'
			| 'image'
			| 'hidden'
		>
	> = {};

	if (name) {
		newProduct.name = name;
	}

	if (symbol) {
		newProduct.symbol = symbol;
	}

	if (category) {
		newProduct.category = category;
	}

	if (subcategory) {
		newProduct.subcategory = subcategory;
	}

	if (price) {
		newProduct.price = price;
	}

	if (producent) {
		newProduct.producent = producent;
	}

	if (weight) {
		newProduct.weight = weight;
	}

	if (description) {
		newProduct.description = description;
	}

	if (imageUrl) {
		newProduct.image = imageUrl;
	}

	if (hidden) {
		newProduct.hidden = hidden;
	}

	console.log('newProduct', newProduct);

	if (Object.keys(newProduct).length === 0) {
		console.log('brak danych do edycji produktu');
		return setError(form, 'Brak danych do edycji', { status: 400 });
	}

	// Edit the product in the db
	const [, editProductError] = await trytm(
		db
			.update(productsTable)
			.set({
				...newProduct
			})
			.where(eq(productsTable.id, id))
	);

	if (editProductError) {
		// Unexpected-error
		console.error('editProductError', editProductError);
		return setError(form, 'Błąd serwera podczas edytowania użytkownika', { status: 500 });
	}

	redirect(303, `/admin/produkty`);
};

export default edit;
