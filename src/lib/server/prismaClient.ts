import { PrismaClient } from '@prisma/client';
import { NODE_ENV } from '$env/static/private';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		// log: ['error'] //NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
	});

if (NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
