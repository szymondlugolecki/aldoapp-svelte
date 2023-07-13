import addToCart from '$lib/server/actions/cart/add.js';
import removeFromCart from '$lib/server/actions/cart/remove';

export const actions = {
	addToCart: addToCart,
	removeFromCart: removeFromCart
};
