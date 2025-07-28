import { z } from 'zod';

// Example of how the generated Zod schemas would be used
// This shows the pattern for validation and type inference

// Example generated schema (based on your watchlist collection)
const WatchlistResponseSchema = z.object({
    id: z.string(),
    created: z.string(),
    updated: z.string(),
    collectionId: z.string(),
    collectionName: z.literal('watchlist'),
    title: z.string().optional(),
    overview: z.string().optional(),
    user_id: z.string(),
    items: z.array(z.string()).optional(),
    visibility: z.enum(['public', 'private', 'followers_only']).optional(),
    is_collaborative: z.boolean().optional(),
});

const WatchlistCreateSchema = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    overview: z.string().optional(),
    user_id: z.string(),
    items: z.union([z.string(), z.array(z.string())]).optional(),
    visibility: z.enum(['public', 'private', 'followers_only']).optional(),
    is_collaborative: z.boolean().optional(),
});

// Type inference from Zod schemas
type WatchlistResponse = z.infer<typeof WatchlistResponseSchema>;
type WatchlistCreate = z.infer<typeof WatchlistCreateSchema>;

// Usage examples
export function validateWatchlistResponse(data: unknown): WatchlistResponse {
    return WatchlistResponseSchema.parse(data);
}

export function validateWatchlistCreate(data: unknown): WatchlistCreate {
    return WatchlistCreateSchema.parse(data);
}

// Safe parsing with error handling
export function safeValidateWatchlist(data: unknown) {
    const result = WatchlistResponseSchema.safeParse(data);
    
    if (result.success) {
        console.log('Valid watchlist:', result.data);
        return result.data;
    } else {
        console.error('Validation errors:', result.error.issues);
        return null;
    }
}

// Example usage with PocketBase client
export async function createWatchlistWithValidation(pb: any, data: unknown) {
    // Validate the input data
    const validatedData = WatchlistCreateSchema.parse(data);
    
    // Create the record (data is now type-safe)
    const record = await pb.collection('watchlist').create(validatedData);
    
    // Validate the response
    return WatchlistResponseSchema.parse(record);
}