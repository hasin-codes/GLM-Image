import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Map user-friendly ratio names to GLM-Image pixel dimensions
// Per docs: width and height must be 512-2048px, multiples of 32
const RATIO_MAP: Record<string, { width: number; height: number }> = {
    '1:1 Square': { width: 1280, height: 1280 },
    '16:9 Cinema': { width: 1728, height: 960 },
    '9:16 Portrait': { width: 960, height: 1728 },
    '4:3 Standard': { width: 1472, height: 1088 },
    '3:4 Tall': { width: 1088, height: 1472 },
    '3:2': { width: 1568, height: 1056 },
    '2:3': { width: 1056, height: 1568 },
};

export async function POST(request: NextRequest) {
    try {
        // Auth check
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized. Please sign in to use image generation.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { prompt, ratio } = body;

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // Get dimensions from ratio, default to 1:1 if not found
        const dimensions = RATIO_MAP[ratio] || RATIO_MAP['1:1 Square'];
        const size = `${dimensions.width}x${dimensions.height}`;

        // Call GLM-Image API
        const apiKey = process.env.ZAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key not configured' },
                { status: 500 }
            );
        }

        const response = await fetch('https://api.z.ai/api/paas/v4/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'glm-image',
                prompt: prompt,
                size: size,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('GLM-Image API Error:', errorText);
            return NextResponse.json(
                { error: 'Failed to generate image' },
                { status: 500 }
            );
        }

        const data = await response.json();
        const imageUrl = data.data?.[0]?.url;

        if (!imageUrl) {
            return NextResponse.json(
                { error: 'No image URL in response' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            imageUrl,
            size,
        });

    } catch (error) {
        console.error('Generate API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
