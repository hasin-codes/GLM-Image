import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { optimizePrompt } from '@/lib/optimizer';
import logger, { logApiError, logApiRequest } from '@/lib/logger';
import { mutationRateLimiter, checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';
import prismadb from '@/lib/prismadb';

/**
 * Request body schema with Zod validation
 */
const bodySchema = z.object({
    prompt: z.string().min(1, 'Prompt is required').max(3000, 'Prompt too long'),
    style: z.string().optional(),
});

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        // Auth check
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized. Please sign in to use image generation.' },
                { status: 401 }
            );
        }

        logApiRequest('/api/optimize', 'POST', userId);

        // Rate limiting
        const rateLimit = await checkRateLimit(mutationRateLimiter, userId);
        if (!rateLimit.success) {
            logger.warn({ userId, endpoint: '/api/optimize' }, 'Rate limit exceeded');
            return rateLimitResponse(rateLimit.reset);
        }

        // Parse and validate request body
        const body = await request.json();
        const validation = bodySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues[0]?.message || 'Invalid request body' },
                { status: 400 }
            );
        }

        const { prompt, style } = validation.data;

        // Call optimizer with retry logic
        const result = await optimizePrompt(prompt, style);

        if (!result.success) {
            // Log to ModerationLog if it looks like a policy violation
            if (result.error?.toLowerCase().includes('policy')) {
                try {
                    await prismadb.moderationLog.create({
                        data: {
                            userId,
                            prompt: prompt.substring(0, 500), // Truncate for storage
                            reason: result.error,
                            stage: 'Optimization',
                        },
                    });
                } catch (dbError) {
                    logger.error({ endpoint: '/api/optimize' }, 'Failed to log moderation event');
                }
            }

            logApiError('/api/optimize', result.error, userId);
            return NextResponse.json(
                { error: result.error || 'Failed to optimize prompt' },
                { status: 500 }
            );
        }

        const duration = Date.now() - startTime;
        logger.info({ userId, durationMs: duration }, 'Optimization completed');

        return NextResponse.json({
            betterPrompt: result.betterPrompt,
            originalPrompt: prompt,
        });

    } catch (error) {
        logApiError('/api/optimize', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
