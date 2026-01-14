import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import logger from '@/lib/logger';

/**
 * Clerk Webhook Event Types
 */
type ClerkWebhookEvent = {
    type: string;
    data: {
        id: string;
        email_addresses: Array<{
            id: string;
            email_address: string;
        }>;
        primary_email_address_id: string;
        created_at: number;
        updated_at: number;
    };
};

/**
 * POST /api/webhooks/clerk - Handle Clerk webhook events
 * 
 * Events handled:
 * - user.created: Create new User in database
 * - user.updated: Update User email if changed
 * - user.deleted: Delete User (cascades to generations)
 */
export async function POST(request: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        logger.error({}, 'CLERK_WEBHOOK_SECRET not configured');
        return NextResponse.json(
            { error: 'Webhook secret not configured' },
            { status: 500 }
        );
    }

    // Get Svix headers for verification
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
        logger.warn({}, 'Missing Svix headers');
        return NextResponse.json(
            { error: 'Missing webhook headers' },
            { status: 400 }
        );
    }

    // Get raw body for verification
    const payload = await request.json();
    const body = JSON.stringify(payload);

    // Verify webhook signature
    const wh = new Webhook(WEBHOOK_SECRET);
    let event: ClerkWebhookEvent;

    try {
        event = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as ClerkWebhookEvent;
    } catch (err) {
        logger.error({ error: err }, 'Webhook signature verification failed');
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        );
    }

    const eventType = event.type;
    const { id: clerkUserId, email_addresses, primary_email_address_id } = event.data;

    // Get primary email
    const primaryEmail = email_addresses.find(
        (email) => email.id === primary_email_address_id
    )?.email_address;

    logger.info({ eventType, clerkUserId }, 'Processing Clerk webhook');

    try {
        switch (eventType) {
            case 'user.created': {
                if (!primaryEmail) {
                    logger.warn({ clerkUserId }, 'No primary email for new user');
                    return NextResponse.json({ received: true });
                }

                await prismadb.user.create({
                    data: {
                        id: clerkUserId,
                        email: primaryEmail,
                    },
                });
                logger.info({ clerkUserId }, 'User created in database');
                break;
            }

            case 'user.updated': {
                if (!primaryEmail) {
                    break;
                }

                await prismadb.user.upsert({
                    where: { id: clerkUserId },
                    update: { email: primaryEmail },
                    create: {
                        id: clerkUserId,
                        email: primaryEmail,
                    },
                });
                logger.info({ clerkUserId }, 'User updated in database');
                break;
            }

            case 'user.deleted': {
                // Delete user - generations cascade automatically
                await prismadb.user.delete({
                    where: { id: clerkUserId },
                }).catch(() => {
                    // User might not exist in DB
                    logger.info({ clerkUserId }, 'User not found for deletion');
                });
                logger.info({ clerkUserId }, 'User deleted from database');
                break;
            }

            default:
                logger.debug({ eventType }, 'Unhandled webhook event type');
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        logger.error({ error, eventType, clerkUserId }, 'Webhook handler error');
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}
