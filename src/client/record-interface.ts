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
} from '../types.js';

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
	/**
	 * Authenticates a user with a password.
	 *
	 * @param usernameOrEmail the username or email of the user
	 * @param password the password of the user
	 * @param options optional settings for the request
	 *
	 * @returns a promise that resolves to the record's authentication response
	 */
	authWithPassword<TSelect extends SelectWithExpand<Collection> = {}>(
		usernameOrEmail: string,
		password: string,
		options?: {
			select?: TSelect;
		} & SendOptions
	): Promise<
		RecordAuthResponse<ResolveSelectWithExpand<Collection, TSelect>>
	>;
	/**
	 * Authenticates a user via OAuth2 authorization code flow.
	 *
	 * @param provider the OAuth2 provider name
	 * @param code the authorization code
	 * @param codeVerifier the code verifier
	 * @param redirectUrl the redirect URL
	 * @param createData optional data to create a new record with (if the user doesn't exist)
	 * @param options optional settings for the request
	 *
	 * @returns a promise that resolves to the record's authentication response
	 */
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
	/**
	 * Authenticates a user using the OAuth2 flow.
	 *
	 * If the user is already authenticated, the request will be rejected.
	 *
	 * @param options settings for the request.
	 * @param options.createData optional data to use when creating a new user.
	 * @param options.select optional select clause for the response.
	 * @param options... additional options to pass to the underlying method.
	 *
	 * @returns a promise that resolves with the authentication response
	 */
	authWithOAuth2(
		options: Omit<OAuth2AuthConfig, 'createData'> & {
			createData?: Collection['create'];
		} & SendOptions
	): Promise<RecordAuthResponse<Collection['response']>>;
	/**
	 * Authenticates a user using the refresh token.
	 *
	 * @param options Optional settings for the request.
	 * @param options.select Optional select clause for the response.
	 * @param options.select Optional select clause for the response.
	 * @returns A promise that resolves to the authenticated user data.
	 */
	authRefresh<TSelect extends SelectWithExpand<Collection> = {}>(
		options?: {
			select?: TSelect;
		} & SendOptions
	): Promise<
		RecordAuthResponse<ResolveSelectWithExpand<Collection, TSelect>>
	>;
	/**
	 * Authenticates a user using the provided OTP id and password.
	 *
	 * Only works with `auth` collections.
	 *
	 * @param otpId the OTP id to use for the authentication
	 * @param password the password to use for the authentication
	 * @param options additional options to pass to the underlying method
	 *
	 * @returns a promise that resolves with the authentication response
	 */
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
