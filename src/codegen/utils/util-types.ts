import { Collection } from "../types.js";

export interface GenerateOptions {
	url: string;
	email: string;
	password: string;
	out?: string;
	ignorePattern?: string;
	includePattern?: string;
}

export interface Columns {
	create: string[];
	update: string[];
	response: string[];
}

export interface Relation {
	name: string;
	target: CollectionDefinition;
	unique: boolean;
}

export interface CollectionDefinition {
	id: string;
	name: string;
	type: Collection['type'];
	typeName: string;
	columns: Columns;
	relations: Relation[];
}
