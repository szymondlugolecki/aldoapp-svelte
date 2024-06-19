// See https://kit.svelte.dev/docs/types#app
// import type { ILazyLoadInstance } from 'vanilla-lazyload';
// import type { SessionUser } from '$types';

// export interface BeforeInstallPromptEvent extends Event {
// 	readonly platforms: string[];
// 	readonly userChoice: Promise<{
// 		outcome: 'accepted' | 'dismissed';
// 		platform: string;
// 	}>;
// 	prompt(): Promise<void>;
// }

// for information about these interfaces
declare global {
	interface BeforeInstallPromptEvent extends Event {
		readonly platforms: string[];
		readonly userChoice: Promise<{
			outcome: 'accepted' | 'dismissed';
			platform: string;
		}>;
		prompt(): Promise<void>;
	}

	interface WindowEventMap {
		beforeinstallprompt: BeforeInstallPromptEvent;
	}

	window.addEventListener('beforeinstallprompt', (e) => {}); // e is now typed

	namespace App {
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}

		interface WindowEventMap {
			beforeinstallprompt: BeforeInstallPromptEvent;
		}
	}
}

export {};
