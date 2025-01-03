import PocketBase, { CommonOptions } from 'pocketbase';
import { GenericCollection, GenericSchema } from './types.js';
import { TypedBatch } from './client/batch-service.js';
import {
	AuthCollectionService,
	BaseCollectionService,
	ViewCollectionService
} from './client/record-interface.js';
import { TypedRecordService } from './client/record-service.js';

export class TypedPocketBase<Schema extends GenericSchema> extends PocketBase {
	/**
	 * Creates a typed {@link TypedRecordService} instance for the given collection.
	 *
	 * @template CollectionName The name of the collection.
	 * @template Collection The collection type. Defaults to `Schema[CollectionName]`.
	 * @param name The name of the collection.
	 * @returns A typed {@link ViewCollectionService} instance if the collection is a view,
	 * a typed {@link BaseCollectionService} instance if the collection is a base collection,
	 * or a typed {@link AuthCollectionService} instance if the collection is an auth collection.
	 */
	from<
		CollectionName extends keyof Schema,
		Collection extends GenericCollection = Schema[CollectionName]
	>(
		name: CollectionName
	): Collection['type'] extends 'view'
		? ViewCollectionService<Collection>
		: Collection['type'] extends 'base'
			? BaseCollectionService<Collection>
			: AuthCollectionService<Collection> {
		return new TypedRecordService(this.collection(name as string)) as any;
	}
	/**
	 * Returns a new instance of {@link TypedBatch} to be used for batching record operations.
	 *
	 * @returns A new instance of {@link TypedBatch}.
	 */
	fromBatch() {
		return new TypedBatch<Schema>(this);
	}
	/**
	 * Temporarily impersonates the provided record id as if it was the real authenticated user.
	 *
	 * Only works for `auth` collections.
	 *
	 * @param collectionName - The collection name of the collection.
	 * @param recordId - The id of the record to impersonate.
	 * @param duration - The amount of milliseconds to impersonate for.
	 * @param options - Additional options to pass to the underlying `impersonate` method.
	 *
	 * @returns A promise that resolves to the impersonated client instance if the collection is an `auth` collection, or `never` otherwise.
	 */
	impersonate<
		CollectionName extends keyof Schema,
		Collection extends GenericCollection = Schema[CollectionName]
	>(
		collectionName: CollectionName,
		recordId: string,
		duration: number,
		options?: CommonOptions
	): Collection['type'] extends 'auth'
		? Promise<Omit<TypedPocketBase<Schema>, 'impersonate'>>
		: Promise<never> {
		return this.collection(collectionName as string)
			.impersonate(recordId, duration, options)
			.then((client) => {
				const typedClient = this;
				Object.assign(typedClient, client);
				delete (typedClient as any).impersonate;
				return typedClient;
			}) as Collection['type'] extends 'auth'
			? Promise<Omit<TypedPocketBase<Schema>, 'impersonate'>>
			: Promise<never>;
	}
	
}
