import { Collection } from "../types.js";
import { CollectionDefinition, Columns, Relation } from "./util-types.js";
import { getFieldType, parseIndex } from "./field-helpers.js";
import { pascalCase } from "./general-helpers.js";


export function createCollectionTypes({
	name,
	relations,
	columns,
	type,
	typeName
}: CollectionDefinition) {
	const prefix = pascalCase(type);
	const base = `${prefix}Collection`;

	let out = `// ===== ${name} =====`;

	const { response, create, update } = columns;

	const responseColumns = [`collectionName: '${name}';`, ...response];

	out += `\n\nexport interface ${typeName}Response extends ${base}Response {\n\t${responseColumns.join(
		`\n\t`
	)}\n}`;

	if (type !== 'view') {
		const createBody = create.length
			? `{\n\t${create.join(`\n\t`)}\n}`
			: '{}';

		out += `\n\nexport interface ${typeName}Create extends ${base}Create ${createBody}`;

		const updateBody = update.length
			? `{\n\t${update.join(`\n\t`)}\n}`
			: '{}';

		out += `\n\nexport interface ${typeName}Update extends ${base}Update ${updateBody}`;
	}

	const createRelations = () => {
		return relations
			.map(
				(r) =>
					`${/^\w+$/.test(r.name) ? r.name : `'${r.name}'`}: ${
						r.target.typeName
					}Collection${r.unique ? '' : '[]'};`
			)
			.join('\n\t\t');
	};

	const collectionBody = [
		`type: '${type}';`,
		`collectionId: string;`,
		`collectionName: '${name}';`,
		`response: ${typeName}Response;`,
		type !== 'view' && `create: ${typeName}Create;`,
		type !== 'view' && `update: ${typeName}Update;`,
		`relations: ${
			relations.length === 0
				? 'Record<string, never>;'
				: `{\n\t\t${createRelations()}\n\t};`
		}`
	].filter(Boolean);

	out += `\n\nexport interface ${typeName}Collection {
	${collectionBody.join('\n\t')}
}`;

	return out;
}

export function buildCollectionDefinitions(collections: Collection[]) {
	const deferred: Array<() => void> = [];
	const definitions = new Map<string, CollectionDefinition>();

	for (const collection of collections) {
		const columns: Columns = {
			create: [],
			update: [],
			response: []
		};
		const relations: Relation[] = [];

		for (const field of collection.fields) {
			// console.log(" === columns before getFieldType ==== ",collection.name);
			// console.log(" == columns update === ",columns.update);
			getFieldType(field, columns);
			if (
				collection.type === 'auth' &&
				!columns.response.includes('tokenKey: string;')
			) {
				columns.response.push('tokenKey: string;');
			}
		
			// console.log(" === columns after getFieldType ==== ",columns);
			if (field.type === 'relation') {
				deferred.push(() => {
					const from = definitions.get(collection.id);
					const target = definitions.get(field.collectionId);

					if (!from)
						throw new Error(
							`Collection ${collection.id} not found for relation ${collection.name}.${field.name}`
						);
					if (!target)
						throw new Error(
							`Collection ${field.collectionId} not found for relation ${collection.name}.${field.name}`
						);

					relations.push({
						name: field.name,
						target,
						unique: field.maxSelect === 1
					});

					/**
					 * indirect expand
					 * @see https://pocketbase.io/docs/expanding-relations/#indirect-expand
					 */

					const indicies = collection.indexes.map(parseIndex);

					const isUnique = indicies.some(
						(index) =>
							index &&
							index.unique &&
							index.fields.length === 1 &&
							index.fields[0] === field.name
					);

					target.relations.push({
						name: `${collection.name}_via_${field.name}`,
						target: from,
						unique: isUnique
					});
				});
			}
		}

		definitions.set(collection.id, {
			id: collection.id,
			name: collection.name,
			type: collection.type,
			columns,
			relations,
			typeName: pascalCase(collection.name)
		});
	}

	deferred.forEach((c) => c());

	return Array.from(definitions.values());
}




