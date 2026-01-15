import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

/**
 * GET /api/stats
 * Returns computed stats for the StatsCard component.
 * Logic is hidden server-side - client only sees computed values.
 */
export async function GET() {
    try {
        // Get generations from the last hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        const hourlyCount = await prismadb.generation.count({
            where: {
                createdAt: {
                    gte: oneHourAgo,
                },
            },
        });

        // Computed values with base offset (hidden logic)
        const genPerHour = 12 + hourlyCount;
        const costValue = 800 + (hourlyCount * 0.25);

        return NextResponse.json({
            genPerHour: genPerHour.toFixed(1),
            costValue: Math.floor(costValue),
            // Static values for now
            hourlyUsers: 68 + Math.floor(hourlyCount / 3),
            impressions: '2.1k',
        });
    } catch (error) {
        console.error('Stats API error:', error);
        // Return fallback values on error
        return NextResponse.json({
            genPerHour: '12.0',
            costValue: 800,
            hourlyUsers: 68,
            impressions: '2.1k',
        });
    }
}
