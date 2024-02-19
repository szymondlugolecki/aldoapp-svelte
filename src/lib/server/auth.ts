import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from './db';
import { sessionsTable } from './db/schemas/sessions';
import { usersTable, type SelectUser } from './db/schemas/users';
import type { Address } from './db/schemas/orders';

export const adapter = new DrizzleSQLiteAdapter(db, sessionsTable, usersTable);

export const lucia = new Lucia(adapter, {
	getUserAttributes: (attributes) => {
		return {
			role: attributes.role,
			fullName: attributes.fullName,
			email: attributes.email,
			phone: attributes.phone,
			address: attributes.address
		};
	},
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
		// DatabaseSessionAttributes: DatabaseSessionAttributes;
	}

	type DatabaseUserAttributes = Pick<SelectUser, 'role' | 'fullName' | 'email' | 'phone'> & {
		address: Address;
	};
}
