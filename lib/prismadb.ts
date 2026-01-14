import { PrismaClient } from '@prisma/client';

/**
 * Prisma v7 client singleton.
 * The datasource URL is configured via prisma.config.ts (DIRECT_URL env var).
 * Global singleton prevents connection exhaustion in dev/hot reloads.
 */
declare global {
    var prisma: PrismaClient | undefined;
}

// Create PrismaClient - Prisma v7 reads config from prisma.config.ts
// Pass empty object to satisfy the constructor requirement
const prismadb = globalThis.prisma || new PrismaClient({});

// Cache in global for Next.js hot reloads (dev mode)
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prismadb;
}

export default prismadb;