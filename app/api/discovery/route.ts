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
    limit: z.coerce.number().min(1).max(50).default(20),
    sort: z.enum(['newest', 'oldest']).default('newest'),
});

/**
 * GET /api/discovery - Get public discovery feed
 * No auth required, but rate limited
 */
export async function GET(request: NextRequest) {
    try {
        logApiRequest('/api/discovery', 'GET');

        // Rate limiting by IP (no auth available)
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'anonymous';

        const rateLimit = await checkRateLimit(readRateLimiter, `discovery:${ip}`);
        if (!rateLimit.success) {
            logger.warn({ ip, endpoint: '/api/discovery' }, 'Rate limit exceeded');
            return rateLimitResponse(rateLimit.reset);
        }

        // Parse query params
        const { searchParams } = new URL(request.url);
        const validation = querySchema.safeParse({
            page: searchParams.get('page') || 1,
            limit: searchParams.get('limit') || 20,
            sort: searchParams.get('sort') || 'newest',
        });

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid query parameters' },
                { status: 400 }
            );
        }

        const { page, limit, sort } = validation.data;
        const skip = (page - 1) * limit;

        // Fetch public generations
        const [generations, total] = await Promise.all([
            prismadb.generation.findMany({
                where: { isPublic: true },
                orderBy: { createdAt: sort === 'newest' ? 'desc' : 'asc' },
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
                    createdAt: true,
                    // No user info exposed for privacy
                },
            }),
            prismadb.generation.count({ where: { isPublic: true } }),
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
        logApiError('/api/discovery', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
