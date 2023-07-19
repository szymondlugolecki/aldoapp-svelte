import sendPush from '$lib/server/actions/push/send';
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
	runtime: 'nodejs18.x'
};

export const actions = {
	push: sendPush
};
