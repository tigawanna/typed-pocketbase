import { BatchService, SendOptions, BatchRequestResult, SubBatchService, RecordOptions } from "pocketbase";
import { TypedPocketBase } from "../client.js";
import { SelectWithExpand } from "../select.js";
import { GenericSchema, GenericCollection } from "../types.js";

export class TypedBatch<Schema extends GenericSchema> {
	private batch: BatchService;

	/**
	 * Creates a new instance of {@link TypedBatch}.
	 *
	 * @param pb The {@link TypedPocketBase} instance to use.
	 */
	constructor(private pb: TypedPocketBase<Schema>) {
		this.batch = pb.createBatch();
	}

	/**
	 * Returns a typed {@link TypedBatchCollection} instance for the given collection.
	 *
	 * @template CollectionName The name of the collection.
	 * @param name The name of the collection.
	 * @returns A typed {@link TypedBatchCollection} instance for the given collection.
	 */
	from<CollectionName extends keyof Schema>(
		name: CollectionName
	): TypedBatchCollection<Schema[CollectionName]> {
		return new TypedBatchCollection(this.batch.collection(name as string));
	}
	/**
	 * Sends all the collected batch operations to the server.
	 *
	 * @param options optional settings for the request
	 *
	 * @returns a promise that resolves to an array of {@link BatchRequestResult}
	 * with the results of all batch operations, in the same order as they were
	 * added to the batch
	 */
	send(options?: SendOptions): Promise<Array<BatchRequestResult>> {
		return this.batch.send(options);
	}
}

export class TypedBatchCollection<Collection extends GenericCollection> {
	constructor(private batchService: SubBatchService) {}

	/**
	 * Creates a new record in the batch service.
	 * @param bodyParams The create data.
	 * @param options Optional options to pass to the underlying `create` method.
	 * @see https://pocketbase.io/docs/api-records/#create-record
	 */
	create(bodyParams: Collection['create'], options?: RecordOptions): void {
		return this.batchService.create(bodyParams, options);
	}
	/**
	 * Creates multiple records in the batch service.
	 * @param bodyParams The list of create data to create the records with.
	 * @param options Optional options to pass to the underlying `create` method.
	 * @see https://pocketbase.io/docs/api-records/#create-record
	 */
	createMany(
		bodyParams: Collection['create'][],
		options?: RecordOptions
	): void {
		return bodyParams.forEach((bodyParam) =>
			this.batchService.create(bodyParam, options)
		);
	}
	/**
	 * Queues an update operation for the given record.
	 *
	 * @param id The id of the record to update.
	 * @param bodyParams The body parameters to update the record with.
	 * @param options Additional options to pass to the underlying `update` method.
	 */
	update(
		id: string,
		bodyParams: Collection['update'],
		options?: RecordOptions
	): void {
		return this.batchService.update(id, bodyParams, options);
	}
	/**
	 * Queues multiple update operations for the same record.
	 *
	 * @param id The id of the record to update.
	 * @param bodyParams The array of body parameters to update the record with.
	 * @param options Additional options to pass to the underlying `update` method.
	 */
	updateMany(
		id: string,
		bodyParams: Collection['update'][],
		options?: RecordOptions
	): void {
		// return this.batchService.update(id, bodyParams, options);
		return bodyParams.forEach((bodyParam) =>
			this.batchService.update(id, bodyParam, options)
		);
	}


	/**
	 * Queues a delete operation for the given record.
	 *
	 * @param bodyParams The body parameters with the `id` of the record to delete.
	 * @param options Additional options to pass to the underlying `delete` method.
	 */
	delete(
		bodyParams: Partial<Collection['update']> & { id: string },
		options?: SendOptions
	): void {
		return this.batchService.delete(bodyParams.id, options);
	}


	/**
	 * Adds multiple delete requests to the batch for the provided `bodyParams`.
	 * @param bodyParams The list of body parameters with the `id` property to delete.
	 * @param options Optional settings for the request.
	 * @returns a promise that resolves when the request is submitted
	 */
	deleteMany(
		bodyParams: Partial<Collection['update']> & { id: string }[],
		options?: SendOptions
	){
		// return this.batchService.delete(id, options);
		return bodyParams.forEach((bodyParam) =>
			this.batchService.delete(bodyParam.id, options)
		);
	}

	/**
	 * Adds a delete request to the batch for the provided `id`.
	 *
	 * @param id the id of the record to delete
	 * @param options optional settings for the request
	 */
	deleteById(id: string, options?: SendOptions): void {
		return this.batchService.delete(id, options);
	}

	/**
	 * Adds multiple delete requests to the batch for the provided `ids`.
	 *
	 * @param ids the ids of the records to delete
	 * @param options optional settings for the request
	 */
	deleteManyById(ids: string[], options?: SendOptions): void {
		// return this.batchService.delete(id, options);
		return ids.forEach((id) => this.batchService.delete(id, options));
	}

	/**

	 * Adds an upsert request to the batch for the provided `bodyParams`.
	 *
	 * @param bodyParams the data to upsert
	 * @param options optional settings for the request
	 * @returns a promise that resolves when the request is submitted
	 */
	upsert(bodyParams: Collection['update'], options?: RecordOptions): void {
		return this.batchService.upsert(bodyParams, options);
	}
}
