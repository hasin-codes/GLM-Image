import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prismadb from '@/lib/prismadb';
import { deleteImage } from '@/lib/supabase';
import logger, { logApiError, logApiRequest } from '@/lib/logger';
import { mutationRateLimiter, checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

/**
 * PATCH body schema - for updating generation
 */
const patchSchema = z.object({
    isPublic: z.boolean().optional(),
});

/**
 * GET /api/generation/[id] - Get a single generation by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const generation = await prismadb.generation.findUnique({
            where: { id },
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
                userId: true,
            },
        });

        if (!generation) {
            return NextResponse.json(
                { error: 'Generation not found' },
                { status: 404 }
            );
        }

        // If not public, require auth and ownership
        if (!generation.isPublic) {
            const { userId } = await auth();
            if (!userId || userId !== generation.userId) {
                return NextResponse.json(
                    { error: 'Generation not found' },
                    { status: 404 }
                );
            }
        }

        // Remove userId from response for privacy
        const { userId: _, ...publicGeneration } = generation;

        return NextResponse.json(publicGeneration);

    } catch (error) {
        logApiError('/api/generation/[id]', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/generation/[id] - Update a generation (toggle isPublic)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        logApiRequest(`/api/generation/${id}`, 'PATCH', userId);

        // Rate limiting
        const rateLimit = await checkRateLimit(mutationRateLimiter, userId);
        if (!rateLimit.success) {
            return rateLimitResponse(rateLimit.reset);
        }

        // Verify ownership
        const existing = await prismadb.generation.findUnique({
            where: { id },
            select: { userId: true },
        });

        if (!existing) {
            return NextResponse.json(
                { error: 'Generation not found' },
                { status: 404 }
            );
        }

        if (existing.userId !== userId) {
            return NextResponse.json(
                { error: 'Forbidden. You can only modify your own generations.' },
                { status: 403 }
            );
        }

        // Parse and validate body
        const body = await request.json();
        const validation = patchSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        // Update generation
        const updated = await prismadb.generation.update({
            where: { id },
            data: validation.data,
            select: {
                id: true,
                isPublic: true,
            },
        });

        logger.info({ userId, generationId: id, isPublic: updated.isPublic }, 'Generation updated');

        return NextResponse.json(updated);

    } catch (error) {
        logApiError('/api/generation/[id]', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/generation/[id] - Delete a generation
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        logApiRequest(`/api/generation/${id}`, 'DELETE', userId);

        // Rate limiting
        const rateLimit = await checkRateLimit(mutationRateLimiter, userId);
        if (!rateLimit.success) {
            return rateLimitResponse(rateLimit.reset);
        }

        // Verify ownership
        const existing = await prismadb.generation.findUnique({
            where: { id },
            select: { userId: true, imageUrl: true },
        });

        if (!existing) {
            return NextResponse.json(
                { error: 'Generation not found' },
                { status: 404 }
            );
        }

        if (existing.userId !== userId) {
            return NextResponse.json(
                { error: 'Forbidden. You can only delete your own generations.' },
                { status: 403 }
            );
        }

        // Delete from Supabase Storage
        try {
            await deleteImage(userId, id);
        } catch (storageError) {
            logger.warn({ generationId: id }, 'Failed to delete from storage, continuing with DB delete');
        }

        // Delete from database
        await prismadb.generation.delete({
            where: { id },
        });

        logger.info({ userId, generationId: id }, 'Generation deleted');

        return NextResponse.json({ success: true });

    } catch (error) {
        logApiError('/api/generation/[id]', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
