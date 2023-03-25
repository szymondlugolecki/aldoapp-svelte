import { prisma } from '$lib/server/clients/prismaClient';
import { trytm } from '@bdsqqq/try';
import { json, error } from '@sveltejs/kit';

const sleep = (s: number) => new Promise((resolve) => setTimeout(resolve, s * 1000));

export async function GET() {
	await sleep(3);

	return json({
		success: true
	});
}
