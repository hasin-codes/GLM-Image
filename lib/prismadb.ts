import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * Prisma v7 client with pg driver adapter.
 * Required for serverless environments like Vercel.
 * Global singleton prevents connection exhaustion in dev/hot reloads.
 */
declare global {
    var prisma: PrismaClient | undefined;
}

// Create pg connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create PrismaClient with adapter
const prismadb = globalThis.prisma || new PrismaClient({ adapter });

// Cache in global for Next.js hot reloads (dev mode)
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prismadb;
}

export default prismadb;