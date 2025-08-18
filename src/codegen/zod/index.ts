import { CollectionField } from 'pocketbase';
import { Collection } from '../types.js';
import { buildCollectionDefinitions } from '../utils/collection-helpers.js';
import { pascalCase } from '../utils/general-helpers.js';
import { filterCollectionsByPatterns } from '../utils/collection-filter.js';

interface CreateZodSchemasOptions {
	collections: Collection[];
	ignorePattern?: string;
	includePattern?: string;
}

export function createZodSchemas(options: Collection[] | CreateZodSchemasOptions): string {
	// Handle both old and new function signatures for backward compatibility
	let collections: Collection[];
	let ignorePattern: string | undefined = '^_.*'; // Default ignore pattern
	let includePattern: string | undefined;

	if (Array.isArray(options)) {
		// Old signature: createZodSchemas(collections)
		collections = options;
	} else {
		// New signature: createZodSchemas({ collections, ignorePattern, includePattern })
		collections = options.collections;
		ignorePattern = options.ignorePattern !== undefined ? options.ignorePattern : '^_.*';
		includePattern = options.includePattern;
	}

	// Filter collections based on patterns
	const filteredCollections = filterCollectionsByPatterns(collections, ignorePattern, includePattern);
	const definitions = buildCollectionDefinitions(filteredCollections);

	const imports = `import { z } from 'zod';`;

	const baseSchemas = `
// Base schemas for common PocketBase fields
const baseResponseSchema = z.object({
    id: z.string(),
    created: z.string(),
    updated: z.string(),
    collectionId: z.string(),
    collectionName: z.string(),
});

const baseCreateSchema = z.object({
    id: z.string().optional(),
});

const baseUpdateSchema = z.object({});

const authResponseSchema = baseResponseSchema.extend({
    username: z.string(),
    email: z.string(),
    tokenKey: z.string().optional(),
    emailVisibility: z.boolean(),
    verified: z.boolean(),
});

const authCreateSchema = baseCreateSchema.extend({
    username: z.string().optional(),
    email: z.string().optional(),
    emailVisibility: z.boolean().optional(),
    password: z.string(),
    passwordConfirm: z.string(),
    verified: z.boolean().optional(),
});

const authUpdateSchema = z.object({
    username: z.string().optional(),
    email: z.string().optional(),
    emailVisibility: z.boolean().optional(),
    oldPassword: z.string().optional(),
    password: z.string().optional(),
    passwordConfirm: z.string().optional(),
    verified: z.boolean().optional(),
});`;

	const collectionSchemas = definitions
		.map((def) => createCollectionZodSchemas(def, filteredCollections))
		.join('\n\n');

	const exportSchemas = `
// Export all schemas
export const schemas = {
${definitions
	.map(
		(def) => `    ${def.name}: {
        response: ${def.typeName}ResponseZodSchema,
        ${def.type !== 'view' ? `create: ${def.typeName}CreateZodSchema,` : ''}
        ${def.type !== 'view' ? `update: ${def.typeName}UpdateZodSchema,` : ''}
    },`
	)
	.join('\n')}
};

export type Schemas = typeof schemas;

// Validation helpers
${definitions.map((def) => createValidationHelpers(def)).join('\n\n')}`;

	return [imports, baseSchemas, collectionSchemas, exportSchemas].join('\n\n');
}

function createCollectionZodSchemas(
	definition: any,
	collections: Collection[]
) {
	const collection = collections.find((c) => c.id === definition.id);
	if (!collection) return '';

	const { name, type, typeName } = definition;
	const prefix = pascalCase(type);
	const baseSchema = `${prefix.toLowerCase()}ResponseSchema`;
	const baseCreateSchema = `${prefix.toLowerCase()}CreateSchema`;
	const baseUpdateSchema = `${prefix.toLowerCase()}UpdateSchema`;

	let schemas = `// ===== ${name} =====`;

	// Response schema
	const responseFields = getZodFieldsForType(collection, 'response');
	schemas += `\n\nexport const ${typeName}ResponseZodSchema = ${baseSchema}.extend({
    collectionName: z.literal('${name}'),
${responseFields.map((field) => `    ${field}`).join(',\n')}
});`;

	if (type !== 'view') {
		// Create schema
		const createFields = getZodFieldsForType(collection, 'create');
		schemas += `\n\nexport const ${typeName}CreateZodSchema = ${baseCreateSchema}.extend({
${createFields.map((field) => `    ${field}`).join(',\n')}
});`;

		// Update schema
		const updateFields = getZodFieldsForType(collection, 'update');
		schemas += `\n\nexport const ${typeName}UpdateZodSchema = ${baseUpdateSchema}.extend({
${updateFields.map((field) => `    ${field}`).join(',\n')}
});`;
	}

	return schemas;
}

function getZodFieldsForType(
	collection: Collection,
	schemaType: 'response' | 'create' | 'update'
): string[] {
	const fields: string[] = [];

	for (const field of collection.fields) {
		if (field.hidden) continue;

		const zodField = getZodFieldType(field, schemaType);
		if (zodField) {
			fields.push(zodField);
		}
	}

	return fields;
}

function getZodFieldType(
	field: CollectionField,
	schemaType: 'response' | 'create' | 'update'
): string | null {
	// For update schemas, all fields except 'id' should be optional
	const isOptional = schemaType === 'update' 
		? field.name !== 'id' 
		: !field.required || field.name === 'id';
	const optionalSuffix = isOptional ? '.optional()' : '';

	switch (field.type) {
		case 'text':
		case 'editor': {
			let schema = 'z.string()';
			if (field.min && field.min > 0) schema += `.min(${field.min})`;
			if (field.max && field.max > 0) schema += `.max(${field.max})`;
			if (field.pattern) schema += `.regex(/${field.pattern}/)`;
			return `${field.name}: ${schema}${optionalSuffix}`;
		}

		case 'email': {
			let schema = 'z.email()';
			return `${field.name}: ${schema}${optionalSuffix}`;
		}

		case 'password': {
			if (schemaType === 'response') return null; // passwords not in response
			let schema = 'z.string()';
			if (field.min) schema += `.min(${field.min})`;
			if (field.max) schema += `.max(${field.max})`;
			return `${field.name}: ${schema}${optionalSuffix}`;
		}

		case 'url': {
			if (schemaType === 'response') {
				return `${field.name}: z.url()${optionalSuffix}`;
			} else {
				return `${field.name}: z.union([z.url(), z.instanceof(URL)])${optionalSuffix}`;
			}
		}

		case 'date':
		case 'autodate': {
			if (schemaType === 'response') {
				return `${field.name}: z.string()${optionalSuffix}`;
			} else {
				return `${field.name}: z.union([z.string(), z.date()])${optionalSuffix}`;
			}
		}

		case 'number': {
			let schema = 'z.number()';
			if (field.min !== null && field.min !== undefined)
				schema += `.min(${field.min})`;
			if (field.max !== null && field.max !== undefined)
				schema += `.max(${field.max})`;

			const result = `${field.name}: ${schema}${optionalSuffix}`;

			if (schemaType === 'update') {
				// Add increment/decrement fields for update
				return [
					result,
					`'${field.name}+': z.number().optional()`,
					`'${field.name}-': z.number().optional()`
				].join(',\n    ');
			}

			return result;
		}

		case 'bool': {
			return `${field.name}: z.boolean()${optionalSuffix}`;
		}

		case 'select': {
			const selectField = field as any;
			const single = selectField.maxSelect === 1 || selectField.maxSelect === 0;
			const values =
				!field.required && single
					? ['', ...selectField.values]
					: selectField.values;

			const enumSchema = `z.enum([${values.map((v: string) => `'${v}'`).join(', ')}])`;

			if (schemaType === 'response') {
				const schema = single ? enumSchema : `z.array(${enumSchema})`;
				return `${field.name}: ${schema}${optionalSuffix}`;
			} else {
				const schema = single
					? enumSchema
					: `z.union([${enumSchema}, z.array(${enumSchema})])`;
				const result = `${field.name}: ${schema}${optionalSuffix}`;

				if (schemaType === 'update' && !single) {
					return [
						result,
						`'${field.name}+': ${schema}.optional()`,
						`'${field.name}-': ${schema}.optional()`
					].join(',\n    ');
				}

				return result;
			}
		}

		case 'relation': {
			const relationField = field as any;
			const single =
				relationField.maxSelect === 1 || relationField.maxSelect === 0;
			const stringSchema = 'z.string()';

			if (schemaType === 'response') {
				const schema = single ? stringSchema : `z.array(${stringSchema})`;
				return `${field.name}: ${schema}${optionalSuffix}`;
			} else {
				const schema = single
					? stringSchema
					: `z.union([${stringSchema}, z.array(${stringSchema})])`;
				const result = `${field.name}: ${schema}${optionalSuffix}`;

				if (schemaType === 'update' && !single) {
					return [
						result,
						`'${field.name}+': ${schema}.optional()`,
						`'${field.name}-': ${schema}.optional()`
					].join(',\n    ');
				}

				return result;
			}
		}

		case 'file': {
			const fileField = field as any;
			const single = fileField.maxSelect === 1 || fileField.maxSelect === 0;

			if (schemaType === 'response') {
				const schema = single ? 'z.string()' : 'z.array(z.string())';
				return `${field.name}: ${schema}${optionalSuffix}`;
			} else {
				const fileSchema = single
					? 'z.instanceof(File).nullable()'
					: 'z.union([z.instanceof(File), z.array(z.instanceof(File))])';
				const result = `${field.name}: ${fileSchema}${optionalSuffix}`;

				if (schemaType === 'update' && !single) {
					return [result, `'${field.name}-': z.string().optional()`].join(
						',\n    '
					);
				}

				return result;
			}
		}

		case 'json': {
			return `${field.name}: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()])${optionalSuffix}`;
		}

		default: {
			console.warn(`Unknown field type: ${(field as any).type}`);
			return `${(field as any)?.name as any}: z.unknown()${optionalSuffix}`;
		}
	}
}

function createValidationHelpers(definition: any) {
	const { name, type, typeName } = definition;

	let helpers = `// Validation helpers for ${name}
export const ${name}Validators = {
    response: (data: unknown) => ${typeName}ResponseZodSchema.parse(data),
    safeResponse: (data: unknown) => ${typeName}ResponseZodSchema.safeParse(data),`;

	if (type !== 'view') {
		helpers += `
    create: (data: unknown) => ${typeName}CreateZodSchema.parse(data),
    safeCreate: (data: unknown) => ${typeName}CreateZodSchema.safeParse(data),
    update: (data: unknown) => ${typeName}UpdateZodSchema.parse(data),
    safeUpdate: (data: unknown) => ${typeName}UpdateZodSchema.safeParse(data),`;
	}

	helpers += `
};

// Type inference helpers for ${name}
export type ${typeName}ResponseZod = z.infer<typeof ${typeName}ResponseZodSchema>;`;

	if (type !== 'view') {
		helpers += `
export type ${typeName}CreateZod = z.infer<typeof ${typeName}CreateZodSchema>;
export type ${typeName}UpdateZod = z.infer<typeof ${typeName}UpdateZodSchema>;`;
	}

	return helpers;
}
