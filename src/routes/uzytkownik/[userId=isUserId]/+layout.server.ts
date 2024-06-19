import { isAtLeastModerator } from '$lib/client/functions';
import { db } from '$lib/server/db/index.js';
import { trytm } from '@bdsqqq/try';
import { error } from '@sveltejs/kit';
import { sql, eq, gte, lte, or } from 'drizzle-orm';
import { ordersTable } from '$lib/server/db/schemas/orders.js';
import { clauseConcat, extractParams } from '$lib/server/functions/utils.js';
import type { BasicUser, OrderSortableColumn } from '$types';

const pageLimit = 10;

const sortableColumns: OrderSortableColumn[] = [
	'status',
	'deliveryMethod',
	'price',
	'estimatedDeliveryDate',
	'createdAt'
];

/*

Possible fitlers for orders:
 - Date range
 - By status
 - By delivery method
 - By payment method

*/

export const load = async ({ params, locals, url }) => {
	const sessionUser = locals.user;
	// In order to see order details, user must be:
	// 1. logged in
	// 2a. must be the owner of the order
	// 2b. must be an admin/mod

	if (!sessionUser) {
		error(401, 'Nie jesteś zalogowany');
	}

	const isMod = isAtLeastModerator(sessionUser.role);
	const userId = params.userId === 'ja' ? sessionUser.id : params.userId;

	const { page, sort, order } = extractParams<OrderSortableColumn>(url, sortableColumns);

	const [user, fetchUserError] = await trytm(
		db.query.usersTable.findFirst({
			where: (user, { eq }) => eq(user.id, userId),
			with: {
				adviser: {
					columns: {
						id: true,
						fullName: true,
						email: true,
						phone: true
					}
				},
				address: {
					columns: {
						id: true,
						street: true,
						zipCode: true,
						city: true
					}
				}
			}
		})
	);

	if (fetchUserError) {
		// Unexpected-error
		console.error('fetchUserError', fetchUserError);
		error(500, 'Wystąpił błąd podczas pobierania danych użytkownika');
	}

	if (!user) {
		error(404, 'Podany użytkownik nie istnieje');
	}

	if (sessionUser.id !== user.id && !isMod) {
		error(401, 'Nie masz uprawnień do przeglądania profilu tego użytkownika');
	}

	const defaultWhereClause = or(
		eq(ordersTable.customerId, userId),
		eq(ordersTable.cartOwnerId, userId)
	);
	const statusClause = order.status && eq(ordersTable.status, order.status);
	const cartOwnerClause = order.cartOwnerId && eq(ordersTable.cartOwnerId, order.cartOwnerId);
	const customerClause = order.customerId && eq(ordersTable.customerId, order.customerId);
	const priceMinClause = order.priceMin && gte(ordersTable.price, order.priceMin);
	const priceMaxClause = order.priceMax && lte(ordersTable.price, order.priceMax);

	console.log('Status', order.status);

	const clausesArr = [
		defaultWhereClause,
		statusClause,
		cartOwnerClause,
		customerClause,
		priceMinClause,
		priceMaxClause
	];

	const extendedWhereClause = clauseConcat(...clausesArr);

	const filtersApplied = clausesArr.length;

	const [ordersUngrouped, fetchOrdersError] = await trytm(
		db.query.ordersTable.findMany({
			where: extendedWhereClause,
			columns: {
				id: true,
				createdAt: true,
				price: true,
				discount: true,
				status: true,
				paymentMethod: true,
				deliveryMethod: true
			},
			with: {
				products: {
					columns: {
						quantity: true,
						productId: true
					},
					with: {
						product: {
							columns: {
								id: true,
								symbol: true,
								name: true,
								encodedURL: true,
								price: true
							}
						}
					}
				},
				customer: {
					columns: {
						id: true,
						fullName: true,
						email: true
					}
				},
				cartOwner: {
					columns: {
						id: true,
						fullName: true,
						email: true
					}
				},
				address: {
					columns: {
						street: true,
						city: true,
						zipCode: true
					}
				}
			},
			offset: (page - 1) * pageLimit,
			orderBy: sort
				? (orders, { asc, desc }) =>
						sort.descending ? desc(orders[sort.by]) : asc(orders[sort.by])
				: (orders, { desc }) => desc(orders.createdAt),
			limit: pageLimit
		})
	);

	if (fetchOrdersError) {
		// Unexpected-error
		console.error('fetchOrdersError', fetchOrdersError);
		error(500, 'Wystąpił błąd podczas pobierania zamówień użytkownika');
	}

	const [unsortedCustomersAndCartOwners, fetchCustomersAndCartOwnersError] = await trytm(
		db.query.ordersTable.findMany({
			where: defaultWhereClause,
			columns: {},
			with: {
				customer: {
					columns: {
						id: true,
						fullName: true,
						email: true
					}
				},
				cartOwner: {
					columns: {
						id: true,
						fullName: true,
						email: true
					}
				}
			},
			...(sort
				? {
						orderBy: (orders, { asc, desc }) =>
							sort.descending ? desc(orders[sort.by]) : asc(orders[sort.by])
				  }
				: {})
		})
	);

	if (fetchCustomersAndCartOwnersError) {
		// Unexpected-error
		console.error('fetchCustomersAndCartOwnersError', fetchCustomersAndCartOwnersError);
		error(500, 'Błąd podczas pobierania zamówień użytkownika');
	}

	const customersAndCartOwners = unsortedCustomersAndCartOwners.reduce(
		(acc, order) => {
			if (order.customer && !acc.customers.find((c) => c.id === order.customer.id)) {
				acc.customers.push(order.customer);
			}

			if (order.cartOwner && !acc.cartOwners.find((c) => c.id === order.cartOwner.id)) {
				acc.cartOwners.push(order.cartOwner);
			}

			return acc;
		},
		{
			customers: [] as BasicUser[],
			cartOwners: [] as BasicUser[]
		}
	);

	// Group orders
	const orders = ordersUngrouped.map((order) => {
		const products = order.products.map((product) => ({
			...product.product,
			quantity: product.quantity
		}));

		return {
			...order,
			products
		};
	});

	const { count } = (
		await db
			.select({
				count: sql<number>`count(*)`.mapWith(Number)
			})
			.from(ordersTable)
			.where(extendedWhereClause)
	)[0];

	return {
		profile: user,
		orders,
		orderDetails: customersAndCartOwners,
		count,
		filtersApplied,
		pageLimit
	};
};
