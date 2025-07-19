import { describe, test, expect, vi, beforeEach } from 'vitest';
import { TypedPocketBase } from './client.js';
import { TypedRecordService } from './client/record-service.js';
import { TypedBatch } from './client/batch-service.js';

// Mock PocketBase
vi.mock('pocketbase', () => {
	return {
		default: class MockPocketBase {
			collection = vi.fn();
			createBatch = vi.fn();
			constructor() {}
		}
	};
});

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
	stats: {
		type: 'view';
		collectionId: 'stats_id';
		collectionName: 'stats';
		response: {
			id: string;
			total_posts: number;
			total_users: number;
		};
		create: never;
		update: never;
		relations: {};
	};
	[K: string]: any;
}

describe('TypedPocketBase', () => {
	let pb: TypedPocketBase<TestSchema>;
	let mockCollection: any;

	beforeEach(() => {
		mockCollection = {
			impersonate: vi.fn(),
			// Add all the forward methods that TypedRecordService expects
			unsubscribe: vi.fn(),
			listAuthMethods: vi.fn(),
			requestPasswordReset: vi.fn(),
			confirmPasswordReset: vi.fn(),
			requestVerification: vi.fn(),
			confirmVerification: vi.fn(),
			requestEmailChange: vi.fn(),
			confirmEmailChange: vi.fn(),
			listExternalAuths: vi.fn(),
			unlinkExternalAuth: vi.fn(),
			requestOTP: vi.fn()
		};
		pb = new TypedPocketBase<TestSchema>();
		pb.collection = vi.fn().mockReturnValue(mockCollection);
		pb.createBatch = vi.fn().mockReturnValue({});
	});

	test('from() returns TypedRecordService', () => {
		const service = pb.from('users');
		expect(service).toBeInstanceOf(TypedRecordService);
		expect(pb.collection).toHaveBeenCalledWith('users');
	});

	test('from() works with different collection types', () => {
		const authService = pb.from('users');
		const baseService = pb.from('posts');
		const viewService = pb.from('stats');

		expect(authService).toBeInstanceOf(TypedRecordService);
		expect(baseService).toBeInstanceOf(TypedRecordService);
		expect(viewService).toBeInstanceOf(TypedRecordService);
	});

	test('fromBatch() returns TypedBatch', () => {
		const batch = pb.fromBatch();
		expect(batch).toBeInstanceOf(TypedBatch);
		expect(pb.createBatch).toHaveBeenCalled();
	});

	test('impersonate() calls collection impersonate method', async () => {
		const mockClient = { some: 'client' };
		mockCollection.impersonate.mockResolvedValue(mockClient);

		const result = await pb.impersonate('users', 'user123', 3600000);

		expect(pb.collection).toHaveBeenCalledWith('users');
		expect(mockCollection.impersonate).toHaveBeenCalledWith('user123', 3600000, undefined);
		expect(result).toBeDefined();
		// The result should be the same instance but with properties from mockClient
		expect(result).toBe(pb);
		expect((result as any).some).toBe('client');
	});

	test('impersonate() passes options correctly', async () => {
		const mockClient = { some: 'client' };
		const options = { headers: { 'Custom-Header': 'value' } };
		mockCollection.impersonate.mockResolvedValue(mockClient);

		await pb.impersonate('users', 'user123', 3600000, options);

		expect(mockCollection.impersonate).toHaveBeenCalledWith('user123', 3600000, options);
	});

	test('impersonate() handles promise rejection', async () => {
		const error = new Error('Impersonation failed');
		mockCollection.impersonate.mockRejectedValue(error);

		await expect(pb.impersonate('users', 'user123', 3600000)).rejects.toThrow('Impersonation failed');
	});
});