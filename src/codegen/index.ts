import PocketBase from 'pocketbase';
import { Collection } from './types.js';
import { GenerateOptions } from './utils/util-types.js';
import { buildCollectionDefinitions } from './utils/collection-helpers.js';
import { getFinalTemplate } from './utils/final-template.js';

export async function generateTypes({ url, email, password }: GenerateOptions) {
	const pb = new PocketBase(url);
	await pb.collection('_superusers').authWithPassword(email, password);
	const collections = await pb.collections.getFullList<Collection>();
	const definitions = buildCollectionDefinitions(collections);
	const definition = getFinalTemplate(definitions);
	return definition;
}
