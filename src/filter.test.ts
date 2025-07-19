import { describe, test, expect } from 'vitest';
import {
	and,
	or,
	eq,
	neq,
	gt,
	gte,
	lt,
	lte,
	like,
	nlike,
	serializeFilter,
	serializeFilters,
	serializeFilterTuple,
	type Filter,
	type FilterOperand
} from './filter.js';

interface TestRecord {
	id: string;
	name: string;
	age: number;
	active: boolean;
	created: Date;
	tags: string[];
	metadata: Record<string, any>;
}

describe('Filter serialization', () => {
	test('serializeFilterTuple handles different value types', () => {
		expect(serializeFilterTuple(['name', '=', 'John'])).toBe("name = 'John'");
		expect(serializeFilterTuple(['age', '>', 25])).toBe('age > 25');
		expect(serializeFilterTuple(['active', '=', true])).toBe('active = true');
		expect(serializeFilterTuple(['active', '=', false])).toBe('active = false');
		expect(serializeFilterTuple(['description', '=', null])).toBe('description = null');
	});

	test('serializeFilterTuple handles Date objects', () => {
		const date = new Date('2023-01-01T12:00:00.000Z');
		const result = serializeFilterTuple(['created', '>=', date]);
		expect(result).toBe("created >= '2023-01-01 12:00:00.000Z'");
	});

	test('serializeFilterTuple handles complex objects', () => {
		const obj = { key: 'value', nested: { prop: 123 } };
		const result = serializeFilterTuple(['metadata', '=', obj]);
		expect(result).toBe("metadata = '{\"key\":\"value\",\"nested\":{\"prop\":123}}'");
	});

	test('serializeFilterTuple escapes quotes in strings', () => {
		const result = serializeFilterTuple(['name', '=', "John's Data"]);
		expect(result).toBe("name = 'John\\'s Data'");
	});

	test('serializeFilter handles different filter types', () => {
		expect(serializeFilter(['name', '=', 'John'])).toBe("name = 'John'");
		expect(serializeFilter("custom filter string")).toBe("custom filter string");
		expect(serializeFilter(null)).toBe(null);
		expect(serializeFilter(undefined)).toBe(null);
		expect(serializeFilter(false)).toBe(null);
	});

	test('serializeFilters filters out falsy values', () => {
		const filters: Filter<any>[] = [
			['name', '=', 'John'] as const,
			null,
			undefined,
			false,
			['age', '>', 25] as const
		];
		const result = serializeFilters(filters);
		expect(result).toEqual(["name = 'John'", "age > 25"]);
	});
});

describe('Filter operators', () => {
	test('eq creates equality filter', () => {
		const filter = eq<TestRecord, 'name'>('name', 'John');
		expect(filter).toBe("name = 'John'");
	});

	test('neq creates not equal filter', () => {
		const filter = neq<TestRecord, 'name'>('name', 'John');
		expect(filter).toBe("name != 'John'");
	});

	test('gt creates greater than filter', () => {
		const filter = gt<TestRecord, 'age'>('age', 25);
		expect(filter).toBe('age > 25');
	});

	test('gte creates greater than or equal filter', () => {
		const filter = gte<TestRecord, 'age'>('age', 25);
		expect(filter).toBe('age >= 25');
	});

	test('lt creates less than filter', () => {
		const filter = lt<TestRecord, 'age'>('age', 25);
		expect(filter).toBe('age < 25');
	});

	test('lte creates less than or equal filter', () => {
		const filter = lte<TestRecord, 'age'>('age', 25);
		expect(filter).toBe('age <= 25');
	});

	test('like creates like filter', () => {
		const filter = like<TestRecord, 'name'>('name', 'John');
		expect(filter).toBe("name ~ 'John'");
	});

	test('nlike creates not like filter', () => {
		const filter = nlike<TestRecord, 'name'>('name', 'John');
		expect(filter).toBe("name !~ 'John'");
	});
});

describe('Logical operators', () => {
	test('and combines filters with AND operator', () => {
		const filter1 = eq<TestRecord, 'name'>('name', 'John');
		const filter2 = gt<TestRecord, 'age'>('age', 25);
		const result = and(filter1, filter2);
		expect(result).toBe("(name = 'John' && age > 25)");
	});

	test('and filters out falsy values', () => {
		const filter1 = eq<TestRecord, 'name'>('name', 'John');
		const result = and(filter1, null, undefined, false);
		expect(result).toBe("(name = 'John')");
	});

	test('and returns empty string when no valid filters', () => {
		const result = and(null, undefined, false);
		expect(result).toBe('');
	});

	test('or combines filters with OR operator', () => {
		const filter1 = eq<TestRecord, 'name'>('name', 'John');
		const filter2 = eq<TestRecord, 'name'>('name', 'Jane');
		const result = or(filter1, filter2);
		expect(result).toBe("(name = 'John' || name = 'Jane')");
	});

	test('or filters out falsy values', () => {
		const filter1 = eq<TestRecord, 'name'>('name', 'John');
		const result = or(filter1, null, undefined, false);
		expect(result).toBe("(name = 'John')");
	});

	test('or returns empty string when no valid filters', () => {
		const result = or(null, undefined, false);
		expect(result).toBe('');
	});

	test('complex nested logical operations', () => {
		const nameFilter = or(
			eq<TestRecord, 'name'>('name', 'John'),
			eq<TestRecord, 'name'>('name', 'Jane')
		);
		const ageFilter = and(
			gte<TestRecord, 'age'>('age', 18),
			lt<TestRecord, 'age'>('age', 65)
		);
		const result = and(nameFilter, ageFilter, eq<TestRecord, 'active'>('active', true));
		expect(result).toBe("((name = 'John' || name = 'Jane') && (age >= 18 && age < 65) && active = true)");
	});
});