import { describe, test, expect, vi, beforeEach } from 'vitest';
import { TypedBatch, TypedBatchCollection } from './batch-service.js';

interface TestSchema {
	users: {
		type: 'auth';
		collectionId: 'users_id';
		collectionName: 'users';
		response: {
			id: string;
			email: string;
			name: string;
		};
		create: {
			email: string;
			password: string;
			name?: string;
		};
		update: {
			email?: string;
			name?: string;
		};
		relations: {};
	};
	posts: {
		type: 'base';
		collectionId: 'posts_id';
		collectionName: 'posts';
		response: {
			id: string;
			title: string;
			content: string;
			author: string;
		};
		create: {
			title: string;
			content: string;
			author: string;
		};
		update: {
			title?: string;
			content?: string;
			author?: string;
		};
		relations: {
			author: TestSchema['users'];
		};
	};
	[K: string]: any;
}

describe('TypedBatch', () => {
	let mockPb: any;
	let mockBatchService: any;
	let mockSubBatchService: any;
	let typedBatch: TypedBatch<TestSchema>;

	beforeEach(() => {
		mockSubBatchService = {
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			upsert: vi.fn()
		};

		mockBatchService = {
			collection: vi.fn().mockReturnValue(mockSubBatchService),
			send: vi.fn()
		};

		mockPb = {
			createBatch: vi.fn().mockReturnValue(mockBatchService)
		};

		typedBatch = new TypedBatch(mockPb);
	});

	test('constructor creates batch service', () => {
		expect(mockPb.createBatch).toHaveBeenCalled();
	});

	test('from() returns TypedBatchCollection', () => {
		const collection = typedBatch.from('users');
		
		expect(collection).toBeInstanceOf(TypedBatchCollection);
		expect(mockBatchService.collection).toHaveBeenCalledWith('users');
	});

	test('send() calls underlying batch send', async () => {
		const options = { headers: { 'Custom-Header': 'value' } };
		const mockResult = [{ success: true }];
		mockBatchService.send.mockResolvedValue(mockResult);

		const result = await typedBatch.send(options);

		expect(mockBatchService.send).toHaveBeenCalledWith(options);
		expect(result).toBe(mockResult);
	});
});

describe('TypedBatchCollection', () => {
	let mockSubBatchService: any;
	let typedBatchCollection: TypedBatchCollection<TestSchema['users']>;

	beforeEach(() => {
		mockSubBatchService = {
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			upsert: vi.fn()
		};

		typedBatchCollection = new TypedBatchCollection(mockSubBatchService);
	});

	test('create() calls underlying service', () => {
		const bodyParams = { email: 'test@example.com', password: 'password' };
		const options = { headers: { 'Custom-Header': 'value' } };

		typedBatchCollection.create(bodyParams, options);

		expect(mockSubBatchService.create).toHaveBeenCalledWith(bodyParams, options);
	});

	test('createMany() calls create for each item', () => {
		const bodyParams = [
			{ email: 'user1@example.com', password: 'password1' },
			{ email: 'user2@example.com', password: 'password2' }
		];
		const options = { headers: { 'Custom-Header': 'value' } };

		typedBatchCollection.createMany(bodyParams, options);

		expect(mockSubBatchService.create).toHaveBeenCalledTimes(2);
		expect(mockSubBatchService.create).toHaveBeenNthCalledWith(1, bodyParams[0], options);
		expect(mockSubBatchService.create).toHaveBeenNthCalledWith(2, bodyParams[1], options);
	});

	test('update() calls underlying service', () => {
		const bodyParams = { name: 'Updated Name' };
		const options = { headers: { 'Custom-Header': 'value' } };

		typedBatchCollection.update('user123', bodyParams, options);

		expect(mockSubBatchService.update).toHaveBeenCalledWith('user123', bodyParams, options);
	});

	test('updateMany() calls update for each item', () => {
		const bodyParams = [
			{ name: 'Name 1' },
			{ name: 'Name 2' }
		];
		const options = { headers: { 'Custom-Header': 'value' } };

		typedBatchCollection.updateMany('user123', bodyParams, options);

		expect(mockSubBatchService.update).toHaveBeenCalledTimes(2);
		expect(mockSubBatchService.update).toHaveBeenNthCalledWith(1, 'user123', bodyParams[0], options);
		expect(mockSubBatchService.update).toHaveBeenNthCalledWith(2, 'user123', bodyParams[1], options);
	});

	test('delete() calls underlying service with id from bodyParams', () => {
		const bodyParams = { id: 'user123', name: 'Test User' };
		const options = { headers: { 'Custom-Header': 'value' } };

		typedBatchCollection.delete(bodyParams, options);

		expect(mockSubBatchService.delete).toHaveBeenCalledWith('user123', options);
	});

	test('deleteMany() calls delete for each item', () => {
		const bodyParams = [
			{ id: 'user1', name: 'User 1' },
			{ id: 'user2', name: 'User 2' }
		];
		const options = { headers: { 'Custom-Header': 'value' } };

		typedBatchCollection.deleteMany(bodyParams, options);

		expect(mockSubBatchService.delete).toHaveBeenCalledTimes(2);
		expect(mockSubBatchService.delete).toHaveBeenNthCalledWith(1, 'user1', options);
		expect(mockSubBatchService.delete).toHaveBeenNthCalledWith(2, 'user2', options);
	});

	test('deleteById() calls underlying service', () => {
		const options = { headers: { 'Custom-Header': 'value' } };

		typedBatchCollection.deleteById('user123', options);

		expect(mockSubBatchService.delete).toHaveBeenCalledWith('user123', options);
	});

	test('deleteManyById() calls delete for each id', () => {
		const ids = ['user1', 'user2', 'user3'];
		const options = { headers: { 'Custom-Header': 'value' } };

		typedBatchCollection.deleteManyById(ids, options);

		expect(mockSubBatchService.delete).toHaveBeenCalledTimes(3);
		expect(mockSubBatchService.delete).toHaveBeenNthCalledWith(1, 'user1', options);
		expect(mockSubBatchService.delete).toHaveBeenNthCalledWith(2, 'user2', options);
		expect(mockSubBatchService.delete).toHaveBeenNthCalledWith(3, 'user3', options);
	});

	test('upsert() calls underlying service', () => {
		const bodyParams = { id: 'user123', name: 'Upserted User' };
		const options = { headers: { 'Custom-Header': 'value' } };

		typedBatchCollection.upsert(bodyParams, options);

		expect(mockSubBatchService.upsert).toHaveBeenCalledWith(bodyParams, options);
	});
});