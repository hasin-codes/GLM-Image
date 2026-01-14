import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prismadb from '@/lib/prismadb';
import logger, { logApiError, logApiRequest } from '@/lib/logger';
import { readRateLimiter, checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

/**
 * Query params schema
 */
const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
});

/**
 * GET /api/history - Get paginated user generation history
 */
export async function GET(request: NextRequest) {
    try {
        // Auth check
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized. Please sign in to view history.' },
                { status: 401 }
            );
        }

        logApiRequest('/api/history', 'GET', userId);

        // Rate limiting
        const rateLimit = await checkRateLimit(readRateLimiter, userId);
        if (!rateLimit.success) {
            logger.warn({ userId, endpoint: '/api/history' }, 'Rate limit exceeded');
            return rateLimitResponse(rateLimit.reset);
        }

        // Parse query params
        const { searchParams } = new URL(request.url);
        const validation = querySchema.safeParse({
            page: searchParams.get('page') || 1,
            limit: searchParams.get('limit') || 10,
        });

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid query parameters' },
                { status: 400 }
            );
        }

        const { page, limit } = validation.data;
        const skip = (page - 1) * limit;

        // Fetch user's generations
        const [generations, total] = await Promise.all([
            prismadb.generation.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    imageUrl: true,
                    originalPrompt: true,
                    betterPrompt: true,
                    model: true,
                    style: true,
                    aspectRatio: true,
                    isPublic: true,
                    createdAt: true,
                    generationDuration: true,
                },
            }),
            prismadb.generation.count({ where: { userId } }),
        ]);

        const hasMore = skip + generations.length < total;

        return NextResponse.json({
            generations,
            total,
            page,
            limit,
            hasMore,
        });

    } catch (error) {
        logApiError('/api/history', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
