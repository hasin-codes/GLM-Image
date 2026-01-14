import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Redis client for Upstash
 * Uses environment variables: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 */
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Rate limiter for mutation endpoints (optimize, generate)
 * 10 requests per minute sliding window
 */
export const mutationRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
    prefix: 'ratelimit:mutation',
});

/**
 * Rate limiter for read endpoints (history, discovery)
 * 60 requests per minute sliding window
 */
export const readRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'),
    analytics: true,
    prefix: 'ratelimit:read',
});

/**
 * Check rate limit for a given identifier
 * Returns { success, remaining, reset } or throws 429 response data
 */
export async function checkRateLimit(
    limiter: Ratelimit,
    identifier: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
    const result = await limiter.limit(identifier);
    return {
        success: result.success,
        remaining: result.remaining,
        reset: result.reset,
    };
}

/**
 * Create a 429 Too Many Requests response
 */
export function rateLimitResponse(reset: number): Response {
    return new Response(
        JSON.stringify({ error: 'Too many requests. Please slow down.' }),
        {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
            },
        }
    );
}

export { redis };
