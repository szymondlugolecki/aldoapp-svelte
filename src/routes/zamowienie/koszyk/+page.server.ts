import addToCart from '$lib/server/actions/cart/add.js';
import decrementProductFromCart from '$lib/server/actions/cart/decrement.js';
import removeFromCart from '$lib/server/actions/cart/remove';
import clearCart from '$lib/server/actions/cart/clear.js';
import setCustomer from '$lib/server/actions/cart/setCustomer.js';

export const actions = {
	addToCart,
	decrementProductFromCart,
	removeFromCart,
	clearCart,
	setCustomer
};
