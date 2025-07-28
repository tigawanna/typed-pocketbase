import { generateTypes } from '../src/codegen/index.js';

// Example showing different pattern filtering scenarios

async function demonstratePatternFiltering() {
    const baseOptions = {
        url: 'http://127.0.0.1:8090',
        email: 'admin@example.com',
        password: 'admin-password'
    };

    console.log('=== Pattern Filtering Examples ===\n');

    // Example 1: Default behavior - ignore system collections
    console.log('1. Default behavior (ignores collections starting with _):');
    try {
        const defaultResult = await generateTypes(baseOptions);
        console.log('✓ Generated schemas with default ignore pattern');
        // This will exclude _mfas, _otps, _externalAuths, _authOrigins, _superusers, _secrets
        // But include users, watchlist, watchlist_items, etc.
    } catch (error) {
        console.log('Note: This requires valid PocketBase credentials');
    }

    // Example 2: Only generate schemas for user-facing collections
    console.log('\n2. Only user-facing collections (watchlist, users, notifications):');
    const userFacingResult = await generateTypes({
        ...baseOptions,
        zodOptions: {
            includePattern: '^(users|watchlist|notifications|user_profiles).*'
        }
    }).catch(() => console.log('Note: This requires valid PocketBase credentials'));

    // Example 3: Exclude all system and internal collections
    console.log('\n3. Exclude system and internal collections:');
    const publicOnlyResult = await generateTypes({
        ...baseOptions,
        zodOptions: {
            ignorePattern: '^(_|follows|watched_list)'
        }
    }).catch(() => console.log('Note: This requires valid PocketBase credentials'));

    // Example 4: Only authentication-related collections
    console.log('\n4. Only authentication-related collections:');
    const authOnlyResult = await generateTypes({
        ...baseOptions,
        zodOptions: {
            includePattern: '^(users|_superusers|_mfas|_otps)$'
        }
    }).catch(() => console.log('Note: This requires valid PocketBase credentials'));

    // Example 5: Everything except secrets
    console.log('\n5. Everything except secrets:');
    const noSecretsResult = await generateTypes({
        ...baseOptions,
        zodOptions: {
            ignorePattern: '^_secrets$'
        }
    }).catch(() => console.log('Note: This requires valid PocketBase credentials'));

    console.log('\n=== Pattern Usage Tips ===');
    console.log('• ignorePattern: Collections matching this regex are excluded');
    console.log('• includePattern: Only collections matching this regex are included');
    console.log('• Both patterns can be used together (include first, then exclude)');
    console.log('• Default ignorePattern is "^_.*" (excludes system collections)');
    console.log('• Use undefined to disable a pattern');
}

// Practical usage examples
export const commonPatterns = {
    // Only user-facing collections
    userFacing: {
        includePattern: '^(users|watchlist|notifications|user_profiles).*'
    },
    
    // Exclude all system collections
    noSystem: {
        ignorePattern: '^_'
    },
    
    // Only authentication collections
    authOnly: {
        includePattern: '^(users|_superusers)$'
    },
    
    // Everything except secrets and internal auth
    publicApi: {
        ignorePattern: '^(_secrets|_mfas|_otps|_externalAuths|_authOrigins)$'
    },
    
    // Only collections with specific prefix
    watchlistOnly: {
        includePattern: '^watchlist'
    },
    
    // Include all collections (no filtering)
    all: {
        ignorePattern: undefined
    }
};

// Usage example
async function generateWithPatterns() {
    const result = await generateTypes({
        url: 'http://127.0.0.1:8090',
        email: 'admin@example.com',
        password: 'admin-password',
        zodOptions: commonPatterns.userFacing
    });

    // Write filtered schemas
    await import('fs/promises').then(fs => {
        fs.writeFile('user-facing-schemas.ts', result.zodSchemas);
    });
}

export { demonstratePatternFiltering, generateWithPatterns };