import { describe, test, expect, vi, beforeEach } from 'vitest';
import { TypedPocketBase } from './client.js';
import { and, or, eq, gt, like } from './filter.js';
import type { SelectWithExpand } from './select.js';

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
			age: number;
			created: string;
			updated: string;
		};
		create: {
			email: string;
			password: string;
			name?: string;
			age?: number;
		};
		update: {
			email?: string;
			name?: string;
			age?: number;
		};
		relations: {
			posts: TestSchema['posts'][];
		};
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
			published: boolean;
			created: string;
			updated: string;
		};
		create: {
			title: string;
			content: string;
			author: string;
			published?: boolean;
		};
		update: {
			title?: string;
			content?: string;
			author?: string;
			published?: boolean;
		};
		relations: {
			author: TestSchema['users'];
		};
	};
	[K: string]: any;
}

describe('Integration Tests', () => {
	let pb: TypedPocketBase<TestSchema>;
	let mockCollection: any;
	let mockBatchService: any;
	let mockSubBatchService: any;

	beforeEach(() => {
		mockCollection = {
			getFullList: vi.fn(),
			getList: vi.fn(),
			getOne: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			subscribe: vi.fn(),
			// Forward methods
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

		pb = new TypedPocketBase<TestSchema>();
		pb.collection = vi.fn().mockReturnValue(mockCollection);
		pb.createBatch = vi.fn().mockReturnValue(mockBatchService);
	});

	test('complex query with filters, select, and sort', async () => {
		const usersService = pb.from('users');
		
		const complexFilter = and(
			or(
				like('name', 'John'),
				like('name', 'Jane')
			),
			gt('age', 18),
			eq('email', 'test@example.com')
		);

		const select: SelectWithExpand<TestSchema['users']> = {
			id: true,
			name: true,
			email: true,
			expand: {
				posts: {
					id: true,
					title: true,
					published: true
				}
			}
		};

		await usersService.getFullList({
			filter: and(
				or(like('name', 'John'), like('name', 'Jane')),
				gt('age', 18),
				eq('email', 'test@example.com')
			),
			select,
			sort: ['+name', '-created']
		});

		expect(mockCollection.getFullList).toHaveBeenCalledWith({
			filter: "((name ~ 'John' || name ~ 'Jane') && age > 18 && email = 'test@example.com')",
			fields: 'id,name,email,expand.posts.id,expand.posts.title,expand.posts.published',
			expand: 'posts',
			sort: '+name,-created'
		});
	});

	test('batch operations with multiple collections', () => {
		const batch = pb.fromBatch();
		const usersBatch = batch.from('users');
		const postsBatch = batch.from('posts');

		// Create multiple users
		usersBatch.createMany([
			{ email: 'user1@example.com', password: 'password1', name: 'User 1' },
			{ email: 'user2@example.com', password: 'password2', name: 'User 2' }
		]);

		// Create posts
		postsBatch.create({
			title: 'Test Post',
			content: 'This is a test post',
			author: 'user1_id'
		});

		// Update and delete operations
		usersBatch.update('user1_id', { name: 'Updated User 1' });
		postsBatch.deleteById('post1_id');

		expect(batch).toBeDefined();
	});

	test('nested expand queries', async () => {
		const postsService = pb.from('posts');

		const select: SelectWithExpand<TestSchema['posts']> = {
			id: true,
			title: true,
			content: true,
			expand: {
				author: {
					id: true,
					name: true,
					email: true,
					expand: {
						posts: {
							id: true,
							title: true
						}
					}
				}
			}
		};

		await postsService.getList(1, 10, {
			select,
			filter: eq('published', true),
			sort: '-created'
		});

		expect(mockCollection.getList).toHaveBeenCalledWith(1, 10, {
			fields: 'id,title,content,expand.author.id,expand.author.name,expand.author.email,expand.author.expand.posts.id,expand.author.expand.posts.title',
			expand: 'author,author.posts',
			filter: 'published = true',
			sort: '-created'
		});
	});

	test('filter edge cases', () => {
		const usersService = pb.from('users');

		// Test with null values
		// const filterWithNull = eq('name', null);
		expect(usersService.createFilter(eq('name', null as any))).toBe('name = null');

		// Test with boolean values
		// const filterWithBoolean = eq('published', true);
		expect(usersService.createFilter(eq('posts.published', true))).toBe(
			'posts.published = true'
		);

	});

	test('sort combinations', () => {
		const usersService = pb.from('users');

		// Test multiple sort fields
		const multiSort = usersService.createSort('+name', '-age', '+created');
		expect(multiSort).toBe('+name,-age,+created');

		// Test with null/undefined values
		const sortWithNulls = usersService.createSort('+name', null, undefined, '-age');
		expect(sortWithNulls).toBe('+name,-age');

		// Test empty sort
		const emptySort = usersService.createSort();
		expect(emptySort).toBe('');
	});

	test('select field combinations', async () => {
		const usersService = pb.from('users');

		// Test partial field selection
		await usersService.getOne('user123', {
			select: {
				id: true,
				name: true,
				email: false // Should be ignored
			}
		});

		expect(mockCollection.getOne).toHaveBeenCalledWith('user123', {
			fields: 'id,name'
		});

		// Test with no fields selected (should return all)
		await usersService.getOne('user123', {
			select: {}
		});

		expect(mockCollection.getOne).toHaveBeenCalledWith('user123', {
			fields: '*'
		});
	});
});
