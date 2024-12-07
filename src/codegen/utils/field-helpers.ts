import { CollectionField } from "pocketbase";
import { Columns } from "./util-types.js";

export function getFieldType(field: CollectionField,{ response, create, update }: Columns) {
	const addResponse = (type: string, name = field.name) =>
		response.push(`${name}: ${type};`);
	const addCreate = (type: string, name = field.name) =>{
		if(field.name==="id"){
			create.push(`${name}?: ${type};`);
		}else{
			create.push(`${name}${field.required ? '' : '?'}: ${type};`);

		}
	}
	const addUpdate = (type: string, name = field.name) =>{
		if(field.name==="id"){
			update.push(`${name}: ${type};`);
		}else{
			update.push(`${name}${field.required ? '' : '?'}: ${type};`);
		}

	}
	const addAll = (type: string) => {
		addResponse(type);
		addCreate(type);
		addUpdate(type);
	};

	switch (field.type) {
		case 'text':
		case 'editor': // rich text
		case 'email': {
			addAll('string');
			break;
		}
		case 'password': {
			addCreate('string');
			break;
		}
		case 'url': {
			addCreate('string | URL');
			addUpdate('string | URL');
			addResponse('string');
			break;
		}
		case 'date': {
			addCreate('string | Date');
			addUpdate('string | Date');
			addResponse('string');
			break;
		}
		case 'autodate': {
			addCreate('string | Date');
			addUpdate('string | Date');
			addResponse('string');
			break;
		}
		case 'number': {
			const type = 'number';
			addAll(type);
			addUpdate(type, `'${field.name}+'`);
			addUpdate(type, `'${field.name}-'`);
			break;
		}
		case 'bool': {
			addAll('boolean');
			break;
		}
		case 'select': {
			const selectField = field as CollectionField & {
				maxSelect: number;
				values: string[];
			};
			const single = selectField.maxSelect === 1;
			const values =
				!selectField.required && single
					? ['', ...selectField.values]
					: selectField.values;
			const singleType = values.map((v) => `'${v}'`).join(' | ');
			const type = single ? `${singleType}` : `MaybeArray<${singleType}>`;

			addResponse(single ? singleType : `Array<${singleType}>`);
			addCreate(type);
			addUpdate(type);
			if (!single) {
				addUpdate(type, `'${field.name}+'`);
				addUpdate(type, `'${field.name}-'`);
			}

			break;
		}
		case 'relation': {
			const singleType = 'string';
			const single = field.maxSelect === 1;
			const type = single ? singleType : `MaybeArray<${singleType}>`;
			addResponse(single ? singleType : `Array<${singleType}>`);
			addCreate(type);
			addUpdate(type);
			if (!single) {
				addUpdate(type, `'${field.name}+'`);
				addUpdate(type, `'${field.name}-'`);
			}
			break;
		}
		case 'file': {
			const single = field.maxSelect === 1;
			addResponse(single ? 'string' : `Array<string>`);
			addCreate(single ? `File | null` : `MaybeArray<File>`);
			addUpdate(single ? `File | null` : `MaybeArray<File>`);
			if (!single) {
				addUpdate('string', `'${field.name}-'`);
			}
			break;
		}
		case 'json': {
			addAll('Record<string, any> | Array<any> | null');
			break;
		}
		default:
			console.warn(`Unknown type ${(field as { type: string }).type}.`);
			console.warn(
				`Feel free to open an issue about this warning https://github.com/david-plugge/typed-pocketbase/issues.`
			);
			addAll('unknown');
	}
}

export function parseIndex(index: string) {
	const match = index.match(
		/^CREATE(\s+UNIQUE)?\s+INDEX\s+`(\w+)`\s+ON\s+`(\w+)`\s+\(([\s\S]*)\)$/
	);
	if (!match) return null;
	const [_, unique, name, collection, definition] = match;

	const fields = Array.from(definition.matchAll(/`(\S*)`/g)).map((m) => m[1]);

	return {
		unique: !!unique,
		name,
		collection,
		fields
	};
}
