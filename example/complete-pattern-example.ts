import { generateTypes } from '../src/codegen/index.js';
import { z } from 'zod';

// Complete example showing pattern filtering with real-world scenarios

async function completePatternExample() {
    const baseConfig = {
        url: 'http://127.0.0.1:8090',
        email: 'admin@example.com',
        password: 'admin-password'
    };

    console.log('=== Complete Pattern Filtering Example ===\n');

    // Scenario 1: Public API - Only user-facing collections
    console.log('📱 Scenario 1: Public API Collections');
    try {
        const publicApiResult = await generateTypes({
            ...baseConfig,
            zodOptions: {
                includePattern: '^(users|watchlist|notifications|user_profiles).*',
                ignorePattern: '^_' // Extra safety to exclude any system collections
            }
        });

        // Write public API schemas
        await import('fs/promises').then(fs => {
            fs.writeFile('generated-public-api-schemas.ts', publicApiResult.zodSchemas);
        });

        console.log('✅ Generated public API schemas');
        console.log('   Includes: users, watchlist, notifications, user_profiles');
        console.log('   Excludes: _secrets, _mfas, internal collections\n');

    } catch (error) {
        console.log('ℹ️  Note: Requires valid PocketBase credentials\n');
    }

    // Scenario 2: Admin Dashboard - Include system collections but exclude secrets
    console.log('🔧 Scenario 2: Admin Dashboard Collections');
    try {
        const adminResult = await generateTypes({
            ...baseConfig,
            zodOptions: {
                ignorePattern: '^(_secrets|_authOrigins)$' // Exclude only sensitive collections
            }
        });

        await import('fs/promises').then(fs => {
            fs.writeFile('generated-admin-schemas.ts', adminResult.zodSchemas);
        });

        console.log('✅ Generated admin dashboard schemas');
        console.log('   Includes: Most collections including _mfas, _otps');
        console.log('   Excludes: _secrets, _authOrigins\n');

    } catch (error) {
        console.log('ℹ️  Note: Requires valid PocketBase credentials\n');
    }

    // Scenario 3: Authentication Service - Only auth-related collections
    console.log('🔐 Scenario 3: Authentication Service Collections');
    try {
        const authResult = await generateTypes({
            ...baseConfig,
            zodOptions: {
                includePattern: '^(users|_superusers|_mfas|_otps|_externalAuths)$'
            }
        });

        await import('fs/promises').then(fs => {
            fs.writeFile('generated-auth-schemas.ts', authResult.zodSchemas);
        });

        console.log('✅ Generated authentication service schemas');
        console.log('   Includes: users, _superusers, _mfas, _otps, _externalAuths');
        console.log('   Excludes: watchlist, notifications, etc.\n');

    } catch (error) {
        console.log('ℹ️  Note: Requires valid PocketBase credentials\n');
    }

    // Scenario 4: Development/Testing - All collections
    console.log('🧪 Scenario 4: Development/Testing - All Collections');
    try {
        const devResult = await generateTypes({
            ...baseConfig,
            zodOptions: {
                ignorePattern: undefined // Include everything
            }
        });

        await import('fs/promises').then(fs => {
            fs.writeFile('generated-dev-schemas.ts', devResult.zodSchemas);
        });

        console.log('✅ Generated development schemas');
        console.log('   Includes: ALL collections (no filtering)');
        console.log('   Use for: Development, testing, debugging\n');

    } catch (error) {
        console.log('ℹ️  Note: Requires valid PocketBase credentials\n');
    }

    console.log('=== Usage Examples ===\n');
    showUsageExamples();
}

function showUsageExamples() {
    console.log('// Example: Using generated schemas with validation');
    console.log(`
import { 
    WatchlistCreateSchema, 
    UsersResponseSchema,
    watchlistValidators 
} from './generated-public-api-schemas.js';

// Validate user input for creating a watchlist
async function createWatchlist(inputData: unknown) {
    try {
        // Validate input data
        const validData = WatchlistCreateSchema.parse(inputData);
        
        // Create record with validated data
        const record = await pb.collection('watchlist').create(validData);
        
        // Validate response
        return WatchlistResponseSchema.parse(record);
        
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation errors:', error.issues);
            throw new Error('Invalid watchlist data');
        }
        throw error;
    }
}

// Safe validation with error handling
function validateUserData(userData: unknown) {
    const result = watchlistValidators.safeResponse(userData);
    
    if (result.success) {
        console.log('Valid user data:', result.data);
        return result.data;
    } else {
        console.error('Validation failed:', result.error.issues);
        return null;
    }
}
`);

    console.log('=== Pattern Filtering Benefits ===');
    console.log('✅ Smaller bundle sizes (only needed schemas)');
    console.log('✅ Better security (exclude sensitive collections)');
    console.log('✅ Cleaner APIs (focus on relevant collections)');
    console.log('✅ Faster compilation (fewer schemas to process)');
    console.log('✅ Better organization (separate schemas by use case)');
}

// Export common pattern configurations for reuse
export const patternConfigs = {
    publicApi: {
        includePattern: '^(users|watchlist|notifications|user_profiles).*',
        ignorePattern: '^_'
    },
    
    adminDashboard: {
        ignorePattern: '^(_secrets|_authOrigins)$'
    },
    
    authService: {
        includePattern: '^(users|_superusers|_mfas|_otps|_externalAuths)$'
    },
    
    development: {
        ignorePattern: undefined
    },
    
    userFacingOnly: {
        includePattern: '^(users|watchlist|notifications)$'
    },
    
    noSecrets: {
        ignorePattern: '^_secrets$'
    }
};

// Helper function to generate schemas with predefined patterns
export async function generateSchemasWithPattern(
    patternName: keyof typeof patternConfigs,
    baseConfig: { url: string; email: string; password: string }
) {
    return generateTypes({
        ...baseConfig,
        zodOptions: patternConfigs[patternName]
    });
}

// Run the example
if (import.meta.url === `file://${process.argv[1]}`) {
    completePatternExample().catch(console.error);
}