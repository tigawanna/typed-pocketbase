import { describe, test, expect } from 'vitest';
import type { Sort } from './sort.js';

interface TestRecord {
	id: string;
	name: string;
	age: number;
	created: string;
	updated: string;
}

describe('Sort type', () => {
	test('Sort type accepts valid sort strings', () => {
		// These should compile without errors
		const sorts: Sort<TestRecord>[] = [
			'+name',
			'-name',
			'+age',
			'-age',
			'+created',
			'-updated',
			null,
			undefined,
			false
		];

		// Test that falsy values are handled correctly
		const validSorts = sorts.filter(Boolean);
		expect(validSorts).toEqual(['+name', '-name', '+age', '-age', '+created', '-updated']);
	});

	test('Sort type structure is correct', () => {
		// Test ascending sort
		const ascSort: Sort<TestRecord> = '+name';
		expect(ascSort).toBe('+name');

		// Test descending sort
		const descSort: Sort<TestRecord> = '-age';
		expect(descSort).toBe('-age');

		// Test falsy values
		const nullSort: Sort<TestRecord> = null;
		const undefinedSort: Sort<TestRecord> = undefined;
		const falseSort: Sort<TestRecord> = false;

		expect(nullSort).toBe(null);
		expect(undefinedSort).toBe(undefined);
		expect(falseSort).toBe(false);
	});
});