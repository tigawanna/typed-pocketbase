import PocketBase from 'pocketbase';
import { Collection } from './types.js';
import { GenerateOptions } from './utils/util-types.js';
import { buildCollectionDefinitions } from './utils/collection-helpers.js';
import { getFinalTemplate } from './utils/final-template.js';
import { createZodSchemas } from './zod/index.js';
import { filterCollectionsByPatterns } from './utils/collection-filter.js';

export async function generateTypes({
	url,
	email,
	password,
	ignorePattern,
	includePattern
}: GenerateOptions) {
	const pb = new PocketBase(url);
	await pb.collection('_superusers').authWithPassword(email, password);
	const collections = await pb.collections.getFullList<Collection>();
	
	// Generate Zod schemas with pattern filtering
	const zodSchemas = createZodSchemas({
		collections,
		ignorePattern,
		includePattern
	});
	
	// Generate TypeScript types (no filtering for backward compatibility)
	const definitions = buildCollectionDefinitions(collections);
	const definition = getFinalTemplate(definitions);
	
	return {
		types: definition,
		zodSchemas
	};
}
