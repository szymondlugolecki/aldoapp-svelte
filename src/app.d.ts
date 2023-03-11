// See https://kit.svelte.dev/docs/types#app
// import type { ILazyLoadInstance } from 'vanilla-lazyload';
import type { SessionUser } from '$types';

// for information about these interfaces
declare global {
	// interface Document {
	// 	lazyloadInstance?: ILazyLoadInstance;
	// }
	namespace App {
		// interface Error {}
		interface Locals {
			session?: {
				user: SessionUser;
				expires: Date;
			} | null;
		}
		interface PageData {
			user: SessionUser | undefined;
		}
		// interface Platform {}
	}

	declare namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:outside_click'?: CompositionEventHandler<T>;
		}
	}
}
