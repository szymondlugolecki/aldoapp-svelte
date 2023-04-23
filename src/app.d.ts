// See https://kit.svelte.dev/docs/types#app
// import type { ILazyLoadInstance } from 'vanilla-lazyload';
import type { SessionUser } from '$types';

interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
		platform: string;
	}>;
	prompt(): Promise<void>;
}

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
			updateData?: unknown;
		}
		interface PageData {
			user: SessionUser | undefined;
		}
		// interface Platform {}

		interface WindowEventMap {
			beforeinstallprompt: BeforeInstallPromptEvent;
		}
	}

	declare namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:outside_click'?: CompositionEventHandler<T>;
		}
	}
}
