import PocketBase, {
	RecordSubscription,
	SendOptions,
	UnsubscribeFunc,
	ListResult,
	RecordService,
	RecordAuthResponse,
	OAuth2AuthConfig,
    CommonOptions,
} from 'pocketbase';
import { Filter } from '../filter.js';
import { Sort } from '../sort.js';
import { SelectWithExpand, ResolveSelectWithExpand } from '../select.js';
import {
	GenericCollection,
	BaseRecord,
	RecordWithExpandToDotPath,
	MaybeArray,
	GenericSchema
} from '../types.js';
import { TypedPocketBase } from '../client.js';

export const FORWARD_METHODS = [
	'unsubscribe',
	'listAuthMethods',
	'requestPasswordReset',
	'confirmPasswordReset',
	'requestVerification',
	'confirmVerification',
	'requestEmailChange',
	'confirmEmailChange',
	'listExternalAuths',
	'unlinkExternalAuth',
	'requestOTP'
] as const;

export interface ViewCollectionService<
	Collection extends GenericCollection,
	ExpandedRecord extends BaseRecord = RecordWithExpandToDotPath<Collection>
> {
	collectionName: Collection['collectionName'];
	client: PocketBase;

	subscribe<TSelect extends SelectWithExpand<Collection> | undefined>(
		topic: string,
		callback: (
			data: RecordSubscription<
				ResolveSelectWithExpand<Collection, TSelect>
			>
		) => void,
		options?: {
			select?: TSelect;
		} & SendOptions
	): Promise<UnsubscribeFunc>;

	getFullList<TSelect extends SelectWithExpand<Collection> | undefined>(
		options?: {
			select?: TSelect;
			page?: number;
			perPage?: number;
			sort?: MaybeArray<Sort<ExpandedRecord>>;
			filter?: Filter<ExpandedRecord>;
		} & SendOptions
	): Promise<ResolveSelectWithExpand<Collection, TSelect>[]>;
	getList<TSelect extends SelectWithExpand<Collection> = {}>(
		page?: number,
		perPage?: number,
		options?: {
			select?: TSelect;
			sort?: MaybeArray<Sort<ExpandedRecord>>;
			filter?: Filter<ExpandedRecord>;
		} & SendOptions
	): Promise<ListResult<ResolveSelectWithExpand<Collection, TSelect>>>;
	getFirstListItem<TSelect extends SelectWithExpand<Collection> = {}>(
		filter: Filter<ExpandedRecord>,
		options?: {
			select?: TSelect;
			sort?: MaybeArray<Sort<ExpandedRecord>>;
		} & SendOptions
	): Promise<ResolveSelectWithExpand<Collection, TSelect>>;
	getOne<TSelect extends SelectWithExpand<Collection> = {}>(
		id: string,
		options?: {
			select?: TSelect;
		} & SendOptions
	): Promise<ResolveSelectWithExpand<Collection, TSelect>>;

	createFilter(filter: Filter<ExpandedRecord>): Filter<ExpandedRecord>;

	createSort(...sort: Sort<ExpandedRecord>[]): Sort<ExpandedRecord>;

	createSelect<T extends SelectWithExpand<Collection>>(select: T): T;
}

export interface BaseCollectionService<Collection extends GenericCollection>
	extends ViewCollectionService<Collection> {
	create<TSelect extends SelectWithExpand<Collection> = {}>(
		bodyParams: Collection['create'],
		options?: {
			select?: TSelect;
		} & SendOptions
	): Promise<ResolveSelectWithExpand<Collection, TSelect>>;
	update<TSelect extends SelectWithExpand<Collection> = {}>(
		id: string,
		bodyParams: Collection['update'],
		options?: {
			select?: TSelect;
		} & SendOptions
	): Promise<ResolveSelectWithExpand<Collection, TSelect>>;
	delete(id: string): Promise<boolean>;
}

export interface AuthCollectionService<Collection extends GenericCollection>
	extends BaseCollectionService<Collection>,
		Pick<RecordService, (typeof FORWARD_METHODS)[number]> {
	authWithPassword<TSelect extends SelectWithExpand<Collection> = {}>(
		usernameOrEmail: string,
		password: string,
		options?: {
			select?: TSelect;
		} & SendOptions
	): Promise<
		RecordAuthResponse<ResolveSelectWithExpand<Collection, TSelect>>
	>;
	authWithOAuth2Code<TSelect extends SelectWithExpand<Collection> = {}>(
		provider: string,
		code: string,
		codeVerifier: string,
		redirectUrl: string,
		createData?: {
			[key: string]: any;
		},
		options?: {
			select?: TSelect;
		} & SendOptions
	): Promise<
		RecordAuthResponse<ResolveSelectWithExpand<Collection, TSelect>>
	>;
	authWithOAuth2(
		options: Omit<OAuth2AuthConfig, 'createData'> & {
			createData?: Collection['create'];
		} & SendOptions
	): Promise<RecordAuthResponse<Collection['response']>>;
	authRefresh<TSelect extends SelectWithExpand<Collection> = {}>(
		options?: {
			select?: TSelect;
		} & SendOptions
	): Promise<
		RecordAuthResponse<ResolveSelectWithExpand<Collection, TSelect>>
	>;
	authWithOTP<TSelect extends SelectWithExpand<Collection> = {}>(
		otpId: string,
		password: string,
		options?: {
			select?: TSelect;
		} & SendOptions
	): Promise<
		RecordAuthResponse<ResolveSelectWithExpand<Collection, TSelect>>
	>;

}
