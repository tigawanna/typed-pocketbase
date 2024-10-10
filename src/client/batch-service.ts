import { BatchService, SendOptions, BatchRequestResult, SubBatchService } from "pocketbase";
import { TypedPocketBase } from "../client.js";
import { SelectWithExpand } from "../select.js";
import { GenericSchema, GenericCollection } from "../types.js";

export class TypedBatch<Schema extends GenericSchema> {
	private batch: BatchService;

	constructor(private pb: TypedPocketBase<Schema>) {
		this.batch = pb.createBatch();
	}

	from<CollectionName extends keyof Schema>(
		name: CollectionName
	): TypedBatchCollection<Schema[CollectionName]> {
		return new TypedBatchCollection(this.batch.collection(name as string));
	}
	send(options?: SendOptions): Promise<Array<BatchRequestResult>> {
		return this.batch.send(options);
	}
}

export class TypedBatchCollection<Collection extends GenericCollection> {
	constructor(private batchService: SubBatchService) {}

	create(
		bodyParams: Collection['create'],
		options?: {
			select?: SelectWithExpand<Collection>;
		} & SendOptions
	): void {
		return this.batchService.create(bodyParams, options);
	}

	update(
		id: string,
		bodyParams: Collection['update'],
		options?: {
			select?: SelectWithExpand<Collection>;
		} & SendOptions
	): void {
		return this.batchService.update(id, bodyParams, options);
	}

	/**
	 * Adds a delete request to the batch for the provided `id`.
	 *
	 * @param id the id of the record to delete
	 * @param options optional settings for the request
	 * @returns a promise that resolves when the request is submitted
	 */
	delete(id: string, options?: SendOptions): void {
		return this.batchService.delete(id, options);
	}

	upsert(
		bodyParams: Collection['update'],
		options?: {
			select?: SelectWithExpand<Collection>;
		} & SendOptions
	): void {
		return this.batchService.upsert(bodyParams, options);
	}
}
