import logger from './logger';

/**
 * Aspect ratio to pixel dimensions mapping
 * Per GLM-Image docs: width and height must be 512-2048px, multiples of 32
 */
export const RATIO_MAP: Record<string, { width: number; height: number }> = {
    '1:1 Square': { width: 1280, height: 1280 },
    '16:9 Cinema': { width: 1728, height: 960 },
    '9:16 Portrait': { width: 960, height: 1728 },
    '4:3 Standard': { width: 1472, height: 1088 },
    '3:4 Tall': { width: 1088, height: 1472 },
    '3:2': { width: 1568, height: 1056 },
    '2:3': { width: 1056, height: 1568 },
};

interface GenerateResult {
    success: boolean;
    imageUrl?: string;
    size?: string;
    error?: string;
}

/**
 * Generate an image using GLM-Image API
 * Includes retry logic with exponential backoff
 * 
 * @param prompt - The optimized prompt to generate from
 * @param ratio - Aspect ratio key (e.g., '1:1 Square')
 * @param maxRetries - Maximum retry attempts (default: 2)
 */
export async function generateImage(
    prompt: string,
    ratio: string = '1:1 Square',
    maxRetries: number = 2
): Promise<GenerateResult> {
    const apiKey = process.env.ZAI_API_KEY;
    if (!apiKey) {
        return { success: false, error: 'API key not configured' };
    }

    const dimensions = RATIO_MAP[ratio] || RATIO_MAP['1:1 Square'];
    const size = `${dimensions.width}x${dimensions.height}`;

    let lastError: string = 'Unknown error';

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
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
                lastError = `API returned ${response.status}`;

                // Check for content moderation error
                if (response.status === 400 && errorText.includes('policy')) {
                    return {
                        success: false,
                        error: 'Content policy violation detected'
                    };
                }

                logger.warn(
                    { attempt, status: response.status, endpoint: 'generate' },
                    'GLM-Image API error, retrying...'
                );

                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
                    continue;
                }
                return { success: false, error: lastError };
            }

            const data = await response.json();
            const imageUrl = data.data?.[0]?.url;

            if (!imageUrl) {
                return { success: false, error: 'No image URL in response' };
            }

            logger.debug({ attempt, size }, 'Image generation successful');
            return { success: true, imageUrl, size };

        } catch (error) {
            lastError = error instanceof Error ? error.message : 'Network error';
            logger.warn(
                { attempt, error: lastError, endpoint: 'generate' },
                'Generation request failed, retrying...'
            );

            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
            }
        }
    }

    return { success: false, error: lastError };
}

/**
 * Download an image from URL and return as Buffer
 * Used for uploading to Supabase Storage
 */
export async function downloadImageAsBuffer(imageUrl: string): Promise<Buffer | null> {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            logger.error({ url: imageUrl, status: response.status }, 'Failed to download image');
            return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    } catch (error) {
        logger.error(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            'Error downloading image'
        );
        return null;
    }
}
