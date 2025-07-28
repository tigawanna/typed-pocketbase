import PocketBase from 'pocketbase';
import { generateTypes } from '../src/codegen/index.js';
import { z } from 'zod';

// Example showing complete integration of Zod schemas with typed-pocketbase

async function setupTypedPocketBaseWithZod() {
    // 1. Generate both TypeScript types and Zod schemas
    const result = await generateTypes({
        url: 'http://127.0.0.1:8090',
        email: 'your-admin@email.com',
        password: 'your-admin-password'
    });

    // 2. Write the generated files
    await import('fs/promises').then(fs => Promise.all([
        fs.writeFile('src/generated/types.ts', result.types),
        fs.writeFile('src/generated/zod-schemas.ts', result.zodSchemas)
    ]));

    console.log('Generated TypeScript types and Zod schemas!');
}

// Example usage with validation
class ValidatedPocketBase {
    private pb: PocketBase;
    
    constructor(url: string) {
        this.pb = new PocketBase(url);
    }

    // Example: Create a watchlist with validation
    async createWatchlist(data: unknown) {
        // Import the generated schema (this would be from your generated file)
        const WatchlistCreateSchema = z.object({
            title: z.string().optional(),
            overview: z.string().optional(),
            user_id: z.string(),
            visibility: z.enum(['public', 'private', 'followers_only']).optional(),
            is_collaborative: z.boolean().optional(),
        });

        // Validate input data
        const validatedData = WatchlistCreateSchema.parse(data);
        
        // Create record with validated data
        const record = await this.pb.collection('watchlist').create(validatedData);
        
        // Validate response (optional but recommended)
        const WatchlistResponseSchema = WatchlistCreateSchema.extend({
            id: z.string(),
            created: z.string(),
            updated: z.string(),
            collectionId: z.string(),
            collectionName: z.literal('watchlist'),
        });
        
        return WatchlistResponseSchema.parse(record);
    }

    // Example: Safe parsing with error handling
    async safeCreateWatchlist(data: unknown) {
        const WatchlistCreateSchema = z.object({
            title: z.string().optional(),
            user_id: z.string(),
            visibility: z.enum(['public', 'private', 'followers_only']).optional(),
        });

        const validation = WatchlistCreateSchema.safeParse(data);
        
        if (!validation.success) {
            return {
                success: false,
                errors: validation.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            };
        }

        try {
            const record = await this.pb.collection('watchlist').create(validation.data);
            return { success: true, data: record };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Example: Validate API responses
    async getWatchlistWithValidation(id: string) {
        const record = await this.pb.collection('watchlist').getOne(id);
        
        // Validate the response matches expected schema
        const WatchlistResponseSchema = z.object({
            id: z.string(),
            title: z.string().optional(),
            overview: z.string().optional(),
            user_id: z.string(),
            visibility: z.enum(['public', 'private', 'followers_only']).optional(),
            is_collaborative: z.boolean().optional(),
            created: z.string(),
            updated: z.string(),
            collectionId: z.string(),
            collectionName: z.literal('watchlist'),
        });

        return WatchlistResponseSchema.parse(record);
    }
}

// Example usage
async function example() {
    const pb = new ValidatedPocketBase('http://127.0.0.1:8090');
    
    // This will validate the input and throw if invalid
    try {
        const watchlist = await pb.createWatchlist({
            title: 'My Favorite Movies',
            user_id: 'user123',
            visibility: 'public',
            is_collaborative: false
        });
        
        console.log('Created watchlist:', watchlist);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation errors:', error.issues);
        } else {
            console.error('Other error:', error);
        }
    }

    // Safe parsing example
    const result = await pb.safeCreateWatchlist({
        title: 'Another List',
        user_id: 'user456',
        visibility: 'invalid_value' // This will cause validation to fail
    });

    if (!result.success) {
        console.error('Validation failed:', result.errors);
    }
}

export { setupTypedPocketBaseWithZod, ValidatedPocketBase, example };