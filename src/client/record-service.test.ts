import { describe, test, expect, vi, beforeEach } from 'vitest';
import { TypedRecordService } from './record-service.js';

// Mock the filter and select modules
vi.mock('../filter.js', () => ({
	serializeFilter: vi.fn((filter) => filter ? `serialized:${filter}` : null)
}));

vi.mock('../select.js', () => ({
	resolveSelect: vi.fn((select) => ({
		fields: select ? 'resolved_fields' : undefined,
		expand: select ? 'resolved_expand' : undefined
	}))
}));

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
	[K: string]: any;
}

describe('TypedRecordService', () => {
	let mockRecordService: any;
	let typedService: TypedRecordService<TestSchema>;

	beforeEach(() => {
		mockRecordService = {
			client: { some: 'client' },
			collectionIdOrName: 'users',
			subscribe: vi.fn(),
			getFullList: vi.fn(),
			getList: vi.fn(),
			getFirstListItem: vi.fn(),
			getOne: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			authWithPassword: vi.fn(),
			authWithOAuth2Code: vi.fn(),
			authWithOAuth2: vi.fn(),
			authRefresh: vi.fn(),
			authWithOTP: vi.fn(),
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

		typedService = new TypedRecordService(mockRecordService);
	});

	test('constructor forwards methods correctly', () => {
		// The constructor should bind forward methods internally
		// We can't test them directly as they're not exposed on the interface
		expect(typedService).toBeInstanceOf(TypedRecordService);
		expect(typedService.service).toBe(mockRecordService);
	});

	test('client getter returns underlying client', () => {
		expect(typedService.client).toBe(mockRecordService.client);
	});

	test('collectionName getter returns collection name', () => {
		expect(typedService.collectionName).toBe('users');
	});

	test('prepareOptions processes select, filter, and sort', () => {
		const options = {
			select: { id: true, name: true },
			filter: 'test_filter',
			sort: ['name', '-created'],
			customOption: 'value'
		};

		// Call a method that uses prepareOptions internally
		typedService.getFullList(options);

		expect(mockRecordService.getFullList).toHaveBeenCalledWith({
			fields: 'resolved_fields',
			expand: 'resolved_expand',
			filter: 'serialized:test_filter',
			sort: 'name,-created',
			customOption: 'value'
		});
	});

	test('prepareOptions handles single sort string', () => {
		const options = {
			sort: 'name'
		};

		typedService.getFullList(options);

		expect(mockRecordService.getFullList).toHaveBeenCalledWith({
			sort: 'name'
		});
	});

	test('prepareOptions handles empty sort array', () => {
		const options = {
			sort: []
		};

		typedService.getFullList(options);

		expect(mockRecordService.getFullList).toHaveBeenCalledWith({
			sort: []
		});
	});

	test('subscribe calls underlying service with prepared options', () => {
		const callback = vi.fn();
		const options = { select: { id: true } };

		typedService.subscribe('topic', callback, options);

		expect(mockRecordService.subscribe).toHaveBeenCalledWith(
			'topic',
			callback,
			{
				fields: 'resolved_fields',
				expand: 'resolved_expand'
			}
		);
	});

	test('getFullList calls underlying service with prepared options', () => {
		const options = { filter: 'test' };

		typedService.getFullList(options);

		expect(mockRecordService.getFullList).toHaveBeenCalledWith({
			filter: 'serialized:test'
		});
	});

	test('getList calls underlying service with prepared options', () => {
		const options = { select: { id: true } };

		typedService.getList(1, 20, options);

		expect(mockRecordService.getList).toHaveBeenCalledWith(1, 20, {
			fields: 'resolved_fields',
			expand: 'resolved_expand'
		});
	});

	test('getFirstListItem calls underlying service with prepared options', () => {
		const options = { sort: 'name' };

		typedService.getFirstListItem('filter', options);

		expect(mockRecordService.getFirstListItem).toHaveBeenCalledWith('filter', {
			sort: 'name'
		});
	});

	test('getOne calls underlying service with prepared options', () => {
		const options = { select: { id: true, name: true } };

		typedService.getOne('123', options);

		expect(mockRecordService.getOne).toHaveBeenCalledWith('123', {
			fields: 'resolved_fields',
			expand: 'resolved_expand'
		});
	});

	test('create calls underlying service with prepared options', () => {
		const bodyParams = { email: 'test@example.com', password: 'password' };
		const options = { select: { id: true } };

		typedService.create(bodyParams, options);

		expect(mockRecordService.create).toHaveBeenCalledWith(bodyParams, {
			fields: 'resolved_fields',
			expand: 'resolved_expand'
		});
	});

	test('update calls underlying service with prepared options', () => {
		const bodyParams = { name: 'Updated Name' };
		const options = { select: { id: true, name: true } };

		typedService.update('123', bodyParams, options);

		expect(mockRecordService.update).toHaveBeenCalledWith('123', bodyParams, {
			fields: 'resolved_fields',
			expand: 'resolved_expand'
		});
	});

	test('delete calls underlying service directly', () => {
		const options = { headers: { 'Custom-Header': 'value' } };

		typedService.delete('123', options);

		expect(mockRecordService.delete).toHaveBeenCalledWith('123', options);
	});

	test('authWithPassword calls underlying service with prepared options', () => {
		const options = { select: { id: true } };

		typedService.authWithPassword('user@example.com', 'password', options);

		expect(mockRecordService.authWithPassword).toHaveBeenCalledWith(
			'user@example.com',
			'password',
			{
				fields: 'resolved_fields',
				expand: 'resolved_expand'
			}
		);
	});

	test('authWithOAuth2Code calls underlying service with prepared options', () => {
		const options = { select: { id: true } };
		const createData = { name: 'New User' };

		typedService.authWithOAuth2Code(
			'google',
			'auth_code',
			'verifier',
			'http://localhost:3000/callback',
			createData,
			options
		);

		expect(mockRecordService.authWithOAuth2Code).toHaveBeenCalledWith(
			'google',
			'auth_code',
			'verifier',
			'http://localhost:3000/callback',
			createData,
			{
				fields: 'resolved_fields',
				expand: 'resolved_expand'
			}
		);
	});

	test('authWithOAuth2 calls underlying service directly', () => {
		const options = { provider: 'google', createData: { name: 'Test' } };

		typedService.authWithOAuth2(options);

		expect(mockRecordService.authWithOAuth2).toHaveBeenCalledWith(options);
	});

	test('authRefresh calls underlying service with prepared options', () => {
		const options = { select: { id: true } };

		typedService.authRefresh(options);

		expect(mockRecordService.authRefresh).toHaveBeenCalledWith({
			fields: 'resolved_fields',
			expand: 'resolved_expand'
		});
	});

	test('authWithOTP calls underlying service with prepared options', () => {
		const options = { select: { id: true } };

		typedService.authWithOTP('otp123', 'password', options);

		expect(mockRecordService.authWithOTP).toHaveBeenCalledWith('otp123', 'password', {
			fields: 'resolved_fields',
			expand: 'resolved_expand'
		});
	});

	test('createFilter calls serializeFilter', () => {
		const filter = 'test_filter';
		const result = typedService.createFilter(filter);

		expect(result).toBe('serialized:test_filter');
	});

	test('createSort joins string sorters', () => {
		const result = typedService.createSort('name', '-created', null, 'email');

		expect(result).toBe('name,-created,email');
	});

	test('createSelect returns select as-is', () => {
		const select = { id: true, name: true };
		const result = typedService.createSelect(select);

		expect(result).toBe(select);
	});
});