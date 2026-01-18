import { Redis } from '@upstash/redis';

/**
 * Redis client for daily limit tracking
 * Uses environment variables: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 */
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Get the daily limit key for a user (UTC-based)
 * Format: gen_limit:{userId}:{YYYY-MM-DD}
 *
 * Uses UTC to avoid timezone inconsistencies across users
 */
function getDailyKey(userId: string): string {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD in UTC
    return `gen_limit:${userId}:${today}`;
}

/**
 * Check and increment daily generation limit for a user
 *
 * This function performs an atomic check-and-increment operation:
 * 1. Gets the current count for the user today
 * 2. If count >= limit, returns { success: false, count }
 * 3. Otherwise, increments the counter and sets expiration if first use
 *
 * @param userId - Clerk user ID
 * @param limit - Maximum number of generations allowed per day
 * @returns Object with success status and current count
 */
export async function checkDailyLimit(
    userId: string,
    limit: number
): Promise<{ success: boolean; count: number; remaining: number }> {
    const key = getDailyKey(userId);

    // Atomic: Get current count or initialize to 0
    let count = (await redis.get<number>(key)) ?? 0;

    // Check if limit has been reached
    if (count >= limit) {
        return {
            success: false,
            count,
            remaining: 0,
        };
    }

    // Increment the counter (atomic operation)
    count = await redis.incr(key);

    // Set expiration on first increment (24 hours from now)
    // Key will auto-expire at midnight UTC next day
    if (count === 1) {
        await redis.expire(key, 86400); // 24 hours in seconds
    }

    return {
        success: true,
        count,
        remaining: limit - count,
    };
}

/**
 * Get the current daily generation count for a user
 * Does not increment the counter
 *
 * @param userId - Clerk user ID
 * @returns Current count for today
 */
export async function getDailyCount(userId: string): Promise<number> {
    const key = getDailyKey(userId);
    return (await redis.get<number>(key)) ?? 0;
}

/**
 * Reset the daily limit counter for a user (admin function)
 * Useful for testing or manual overrides
 *
 * @param userId - Clerk user ID
 */
export async function resetDailyLimit(userId: string): Promise<void> {
    const key = getDailyKey(userId);
    await redis.del(key);
}
