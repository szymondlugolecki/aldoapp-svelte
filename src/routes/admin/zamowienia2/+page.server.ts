import { db } from '$lib/server/db';
import { orders as ordersTable } from '$lib/server/db/schemas/orders.js';
import { extractParams } from '$lib/server/functions/utils';
import changeOrderStatus from '$lib/server/actions/orders/changeOrderStatus';
import changePaidStatus from '$lib/server/actions/orders/changeOrderPaymentStatus.js';
import { isAtLeastModerator } from '$lib/client/functions';
import { trytm } from '@bdsqqq/try';
import { error } from '@sveltejs/kit';
import { sql, eq, and, between, gte, lte, SQL } from 'drizzle-orm';
import type { OrderSortableColumn, OrderTable } from '$types';
import getCustomError from '$lib/client/constants/customErrors.js';

const sortableColumns: OrderSortableColumn[] = [
	'status',
	'deliveryMethod',
	'price',
	'estimatedDeliveryDate',
	'createdAt'
];

const pageLimit = 10;

export const load = async ({ url, locals }) => {
	const sessionUser = locals.session?.user;

	if (!sessionUser) {
		error(...getCustomError('not-logged-in'));
	}
	if (!isAtLeastModerator(sessionUser.role)) {
		error(...getCustomError('insufficient-permissions'));
	}

	const { page, sort, order } = extractParams<OrderSortableColumn>(url, sortableColumns);

	console.log('page', page, sort);

	const statusClause = order.status && eq(ordersTable.status, order.status);
	const cartOwnerClause = order.cartOwnerId
		? eq(ordersTable.cartOwnerId, order.cartOwnerId)
		: undefined;
	const customerClause = order.customerId && eq(ordersTable.customerId, order.customerId);

	let priceClause;
	if (order.price) {
		const bothPrices = !isNaN(order.price.min) && !isNaN(order.price.max);
		if (bothPrices) {
			priceClause = between(
				ordersTable.price,
				order.price.min.toString(),
				order.price.max.toString()
			);
		} else if (!isNaN(order.price.min)) {
			priceClause = gte(ordersTable.price, order.price.min.toString());
		} else if (!isNaN(order.price.max)) {
			priceClause = lte(ordersTable.price, order.price.max.toString());
		}
	}

	const clauseConcat = (...clauses: (SQL<unknown> | undefined | string)[]) => {
		const filteredClauses = clauses.filter((clause) => !!clause) as SQL<unknown>[];
		return and(...filteredClauses);
	};

	const extendedWhereClause = clauseConcat(
		statusClause,
		priceClause,
		cartOwnerClause,
		customerClause
	);
	// const filtersApplied = !!statusClause || !!priceClause || !!cartOwnerClause || !!customerClause;

	const [ordersUngrouped, fetchOrdersError] = await trytm(
		db.query.orders.findMany({
			where: extendedWhereClause,
			columns: {
				id: true,
				createdAt: true,
				status: true,
				paid: true,
				price: true,
				discount: true,
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
				}
			},
			offset: (page - 1) * pageLimit,
			orderBy: sort
				? (orders, { asc, desc }) =>
						sort.descending ? desc(orders[sort.by]) : asc(orders[sort.by])
				: () => [],
			limit: pageLimit
		})
	);

	if (fetchOrdersError) {
		// Unexpected-error
		console.error('fetchOrdersError', fetchOrdersError);
		error(500, 'Błąd podczas pobierania zamówień użytkownika');
	}

	const orders: OrderTable[] = ordersUngrouped.map((o) => {
		const products = o.products.map((product) => ({
			...product.product,
			quantity: product.quantity
		}));

		return {
			...o,
			products
		};
	});

	return {
		orders,
		count: db
			.select({
				count: sql<number>`count(*)`.mapWith(Number)
			})
			.from(ordersTable),
		pageLimit
	};
};

export const actions = {
	changeOrderStatus,
	changePaidStatus
};
