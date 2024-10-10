import {
	CollectionField,
	BaseCollectionModel,
	ViewCollectionModel,
	AuthCollectionModel
} from 'pocketbase';




export type CollectionType = 'auth' | 'view' | 'base';



export interface BaseCollection extends BaseCollectionModel {
	type: 'base';
	options: {};
}

export interface ViewCollection extends ViewCollectionModel {
	type: 'view';
	options: {
		query: string;
	};
}

export interface AuthCollection extends AuthCollectionModel {
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

export interface TextField extends CollectionField {
	type: 'text';
	hidden: boolean;
	min: number | null;
	max: number | null;
	pattern: string | null;
}

export interface EditorField extends CollectionField {
	type: 'editor';
	hidden: boolean;
	exceptDomains: [];
	onlyDomains: [];
}

export interface NumberField extends CollectionField {
	type: 'number';
	hidden: boolean;
	min: number | null;
	max: number | null;
}

export interface BoolField extends CollectionField {
	type: 'bool';
	hidden: boolean;
}
export interface EmailField extends CollectionField {
	type: 'email';
	exceptDomains: [] | null;
	onlyDomains: [] | null;
	hidden: boolean;
}
export interface PasswordField extends CollectionField {
	type: 'password';
	min: number;
	max: number;
	hidden: boolean;
}

export interface UrlField extends CollectionField {
	type: 'url';
	hidden: boolean;
	exceptDomains: [];
	onlyDomains: [];
}

export interface DateField extends CollectionField {
	type: 'date';
	hidden: boolean;
	min: string;
	max: string;
}

export interface AutoDateField extends CollectionField {
	type: 'autodate';
	min: string;
	max: string;
	hidden: boolean;
	onCreate: boolean;
	onUpdate: boolean;
}

export interface SelectField extends CollectionField {
	type: 'select';
	hidden: boolean;
	maxSelect: number;
	values: string[];
}

export interface RelationField extends CollectionField {
	type: 'relation';
	hidden: boolean;
	collectionId: string;
	cascadeDelete: boolean;
	minSelect: number | null;
	maxSelect: number;
	displayFields: string[] | null;
}

export interface FileField extends CollectionField {
	type: 'file';
	hidden: boolean;
	maxSelect: number;
	maxSize: number;
	mimeTypes: string[];
	thumbs: string[] | null;
	protected: boolean;
}

export interface JsonField extends CollectionField {
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
