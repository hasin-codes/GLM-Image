import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client singleton for Storage operations
 * Uses environment variables: SUPABASE_URL, SUPABASE_ANON_KEY
 */
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

/**
 * Upload an image buffer to Supabase Storage
 * @param userId - User ID for folder organization
 * @param imageId - Unique ID for the image file
 * @param buffer - Image data as Buffer
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(
    userId: string,
    imageId: string,
    buffer: Buffer,
    contentType: string = 'image/png'
): Promise<{ url: string | null; error: string | null }> {
    const filePath = `images/${userId}/${imageId}.png`;

    const { error } = await supabase.storage
        .from('generations')
        .upload(filePath, buffer, {
            contentType,
            upsert: false,
        });

    if (error) {
        return { url: null, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from('generations')
        .getPublicUrl(filePath);

    return { url: urlData.publicUrl, error: null };
}

/**
 * Delete an image from Supabase Storage
 * @param userId - User ID for folder path
 * @param imageId - Image ID to delete
 */
export async function deleteImage(
    userId: string,
    imageId: string
): Promise<{ success: boolean; error: string | null }> {
    const filePath = `images/${userId}/${imageId}.png`;

    const { error } = await supabase.storage
        .from('generations')
        .remove([filePath]);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, error: null };
}
