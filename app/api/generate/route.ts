import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateImage, downloadImageAsBuffer, RATIO_MAP } from '@/lib/generator';
import { uploadImage } from '@/lib/supabase';
import logger, { logApiError, logApiRequest } from '@/lib/logger';
import { mutationRateLimiter, checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';
import prismadb from '@/lib/prismadb';

/**
 * Request body schema with Zod validation
 */
const bodySchema = z.object({
    prompt: z.string().min(1, 'Prompt is required'),
    originalPrompt: z.string().optional(),
    ratio: z.string().optional().default('1:1 Square'),
    style: z.string().optional(),
    detailLevel: z.number().min(1).max(10).optional().default(5),
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

        logApiRequest('/api/generate', 'POST', userId);

        // Rate limiting
        const rateLimit = await checkRateLimit(mutationRateLimiter, userId);
        if (!rateLimit.success) {
            logger.warn({ userId, endpoint: '/api/generate' }, 'Rate limit exceeded');
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

        const { prompt, originalPrompt, ratio, style, detailLevel } = validation.data;

        // Generate image with retry logic
        const result = await generateImage(prompt, ratio);

        if (!result.success) {
            // Log moderation violations
            if (result.error?.toLowerCase().includes('policy')) {
                try {
                    await prismadb.moderationLog.create({
                        data: {
                            userId,
                            prompt: prompt.substring(0, 500),
                            reason: result.error,
                            stage: 'Generation',
                        },
                    });
                } catch (dbError) {
                    logger.error({ endpoint: '/api/generate' }, 'Failed to log moderation event');
                }
            }

            logApiError('/api/generate', result.error, userId);
            return NextResponse.json(
                { error: result.error || 'Failed to generate image' },
                { status: 500 }
            );
        }

        // Download image and upload to Supabase Storage
        const generationId = crypto.randomUUID();
        let finalImageUrl = result.imageUrl!;

        try {
            const imageBuffer = await downloadImageAsBuffer(result.imageUrl!);
            if (imageBuffer) {
                const uploadResult = await uploadImage(userId, generationId, imageBuffer);
                if (uploadResult.url) {
                    finalImageUrl = uploadResult.url;
                } else {
                    logger.warn({ error: uploadResult.error }, 'Failed to upload to Supabase, using original URL');
                }
            }
        } catch (uploadError) {
            logger.warn({ error: uploadError }, 'Storage upload failed, using original URL');
        }

        // Calculate analytics
        const duration = Math.round((Date.now() - startTime) / 1000);
        const optimizationDelta = originalPrompt
            ? prompt.length - originalPrompt.length
            : null;

        // Insert Generation record
        try {
            await prismadb.generation.create({
                data: {
                    id: generationId,
                    userId,
                    imageUrl: finalImageUrl,
                    originalPrompt: originalPrompt || prompt,
                    betterPrompt: prompt,
                    model: 'glm-image',
                    style: style || null,
                    aspectRatio: ratio,
                    detailLevel: detailLevel,
                    isPublic: true,
                    optimizationDelta,
                    generationDuration: duration,
                    retryCount: 0,
                },
            });
        } catch (dbError) {
            logger.error({ generationId }, 'Failed to save generation to database');
            // Continue - image was still generated successfully
        }

        logger.info({ userId, generationId, durationSec: duration }, 'Generation completed');

        return NextResponse.json({
            imageUrl: finalImageUrl,
            generationId,
            size: result.size,
        });

    } catch (error) {
        logApiError('/api/generate', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
