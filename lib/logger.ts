import pino from 'pino';

/**
 * Structured logger with automatic redaction of sensitive fields.
 * - In development: debug level, pretty output
 * - In production: info level, JSON output with sensitive data redacted
 */
const logger = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    // Redact sensitive fields to prevent them from appearing in logs
    redact: {
        paths: [
            'apiKey',
            'API_KEY',
            'token',
            'TOKEN',
            'authorization',
            'Authorization',
            'prompt',
            'betterPrompt',
            'originalPrompt',
            '*.apiKey',
            '*.API_KEY',
            '*.token',
            '*.TOKEN',
            '*.authorization',
            '*.Authorization',
            '*.prompt',
            '*.betterPrompt',
            '*.originalPrompt',
        ],
        censor: '[REDACTED]',
    },
    // Format timestamps as ISO strings
    timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;

/**
 * Log an API error with context (no sensitive data exposed)
 */
export function logApiError(
    endpoint: string,
    error: unknown,
    userId?: string
): void {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error(
        {
            endpoint,
            userId: userId ?? 'anonymous',
            errorType: error instanceof Error ? error.name : typeof error,
        },
        `API Error: ${message}`
    );
}

/**
 * Log an API request (for debugging in dev only)
 */
export function logApiRequest(
    endpoint: string,
    method: string,
    userId?: string
): void {
    logger.debug(
        {
            endpoint,
            method,
            userId: userId ?? 'anonymous',
        },
        'API Request'
    );
}
