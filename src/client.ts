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
	fromBatch() {
		return new TypedBatch<Schema>(this);
	}
	impersonate<
		CollectionName extends keyof Schema,
		Collection extends GenericCollection = Schema[CollectionName]
	>(
		name: CollectionName,
		recordId: string,
		duration: number,
		options?: CommonOptions
	): Collection['type'] extends 'auth'
		? Promise<TypedPocketBase<Schema>>
		: Promise<never> {
		return this.collection(name as string).impersonate(
			recordId,
			duration,
			options
		) as Collection['type'] extends 'auth'
			? Promise<TypedPocketBase<Schema>>
			: Promise<never>;
	}
}
