import { error, type Action, redirect } from '@sveltejs/kit';
import { trytm } from '@bdsqqq/try';
import getCustomError from '$lib/client/constants/customErrors';
import { isAtLeastModerator } from '$lib/client/functions';
import { products$ } from '$lib/client/schemas';
import { setError, setMessage, superValidate, fail } from 'sveltekit-superforms';
import { productsTable, type SelectProduct } from '$lib/server/db/schemas/products';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { zod } from 'sveltekit-superforms/adapters';
import { utapi } from '$lib/server/clients/uploadthing';
import sharp from 'sharp';

type ImageType = 'avif' | 'jpeg' | 'jpg' | 'png' | 'webp';
type SvelteKitFetch = (
	input: URL | RequestInfo,
	init?: RequestInit | undefined
) => Promise<Response>;

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
		try {
			// Load the image
			const imageBuffer = await image.arrayBuffer();

			// Resize the image
			const resizedImageBuffer = await sharp(imageBuffer).resize(500).toBuffer();

			// Create a new File from the compressed image buffer
			const imageResized = new File([resizedImageBuffer], image.name);

			// Upload the image
			const { data, error } = await utapi.uploadFiles(imageResized);

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
