import { SchemaField, CollectionModel } from 'pocketbase';

export type CollectionType = 'auth' | 'view' | 'base';

interface GenericCollection extends CollectionModel {
	schema: Field[];
}

export interface BaseCollection extends GenericCollection {
	type: 'base';
	options: {};
}

export interface ViewCollection extends GenericCollection {
	type: 'view';
	options: {
		query: string;
	};
}

export interface AuthCollection extends GenericCollection {
	type: 'auth';
	options: {
		allowEmailAuth: boolean;
		allowOAuth2Auth: boolean;
		allowUsernameAuth: boolean;
		exceptEmailDomains: string[] | null;
		onlyEmailDomains: string[] | null;
		manageRule: string | null;
		minPasswordLength: number;
		requireEmail: boolean;
	};
}

export type Collection = BaseCollection | ViewCollection | AuthCollection;

export type FieldType =
	| 'text'
	| 'editor'
	| 'number'
	| 'bool'
	| 'email'
	| 'password'
	| 'url'
	| 'date'
	| 'autodate'
	| 'select'
	| 'relation'
	| 'file'
	| 'json';

export interface TextField extends SchemaField {
	type: 'text';
	hidden: boolean;
	min: number | null;
	max: number | null;
	pattern: string | null;
}

export interface EditorField extends SchemaField {
	type: 'editor';
	hidden: boolean;
	exceptDomains: [];
	onlyDomains: [];
}

export interface NumberField extends SchemaField {
	type: 'number';
	hidden: boolean;
	min: number | null;
	max: number | null;
}

export interface BoolField extends SchemaField {
	type: 'bool';
	hidden: boolean;
}
export interface EmailField extends SchemaField {
	type: 'email';
	exceptDomains: [] | null;
	onlyDomains: [] | null;
	hidden: boolean;
}
export interface PasswordField extends SchemaField {
	type: 'password';
	min: number;
	max: number;
	hidden: boolean;
}

export interface UrlField extends SchemaField {
	type: 'url';
	hidden: boolean;
	exceptDomains: [];
	onlyDomains: [];
}

export interface DateField extends SchemaField {
	type: 'date';
	hidden: boolean;
	min: string;
	max: string;
}

export interface AutoDateField extends SchemaField {
	type: 'autodate';
	min: string;
	max: string;
	hidden: boolean;
	onCreate: boolean;
	onUpdate: boolean;
}

export interface SelectField extends SchemaField {
	type: 'select';
	hidden: boolean;
	maxSelect: number;
	values: string[];
}

export interface RelationField extends SchemaField {
	type: 'relation';
	hidden: boolean;
	collectionId: string;
	cascadeDelete: boolean;
	minSelect: number | null;
	maxSelect: number;
	displayFields: string[] | null;
}

export interface FileField extends SchemaField {
	type: 'file';
	hidden: boolean;
	maxSelect: number;
	maxSize: number;
	mimeTypes: string[];
	thumbs: string[] | null;
	protected: boolean;
}

export interface JsonField extends SchemaField {
	type: 'json';
	hidden: boolean;
	maxSize: number;
}

export type Field =
	| TextField
	| EditorField
	| NumberField
	| BoolField
	| EmailField
	| UrlField
	| DateField
	| PasswordField
	| AutoDateField
	| SelectField
	| RelationField
	| FileField
	| JsonField;
