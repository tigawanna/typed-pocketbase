// === start of custom type ===
  // WatchlistItems.WatchlistItemsGenre_ids.genre_ids
  export type WatchlistItemsGenre_ids = Array<{
 
  }>;
  // === end of custom type ===

/**
 * This file was @generated using typed-pocketbase
 */

// https://pocketbase.io/docs/collections/#base-collection
export interface BaseCollectionResponse {
	/**
	 * 15 characters string to store as record ID.
	 */
	id: string;
	/**
	 * Date string representation for the creation date.
	 */
	created: string;
	/**
	 * Date string representation for the creation date.
	 */
	updated: string;
	/**
	 * The collection id.
	 */
	collectionId: string;
	/**
	 * The collection name.
	 */
	collectionName: string;
}

// https://pocketbase.io/docs/api-records/#create-record
export interface BaseCollectionCreate {
	/**
	 * 15 characters string to store as record ID.
	 * If not set, it will be auto generated.
	 */
	id?: string;
}

// https://pocketbase.io/docs/api-records/#update-record
export interface BaseCollectionUpdate {}

// https://pocketbase.io/docs/collections/#auth-collection
export interface AuthCollectionResponse extends BaseCollectionResponse {
	/**
	 * The username of the auth record.
	 */
	username: string;
	/**
	 * Auth record email address.
	 */
	email: string;
	/**
	 * Auth record email address.
	 */
	tokenKey?: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility: boolean;
	/**
	 * Indicates whether the auth record is verified or not.
	 */
	verified: boolean;
}

// https://pocketbase.io/docs/api-records/#create-record
export interface AuthCollectionCreate extends BaseCollectionCreate {
	/**
	 * The username of the auth record.
	 * If not set, it will be auto generated.
	 */
	username?: string;
	/**
	 * Auth record email address.
	 */
	email?: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility?: boolean;
	/**
	 * Auth record password.
	 */
	password: string;
	/**
	 * Auth record password confirmation.
	 */
	passwordConfirm: string;
	/**
	 * Indicates whether the auth record is verified or not.
	 * This field can be set only by admins or auth records with "Manage" access.
	 */
	verified?: boolean;
}

// https://pocketbase.io/docs/api-records/#update-record
export interface AuthCollectionUpdate {
	/**
	 * The username of the auth record.
	 */
	username?: string;
	/**
	 * The auth record email address.
	 * This field can be updated only by admins or auth records with "Manage" access.
	 * Regular accounts can update their email by calling "Request email change".
	 */
	email?: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility?: boolean;
	/**
	 * Old auth record password.
	 * This field is required only when changing the record password. Admins and auth records with "Manage" access can skip this field.
	 */
	oldPassword?: string;
	/**
	 * New auth record password.
	 */
	password?: string;
	/**
	 * New auth record password confirmation.
	 */
	passwordConfirm?: string;
	/**
	 * Indicates whether the auth record is verified or not.
	 * This field can be set only by admins or auth records with "Manage" access.
	 */
	verified?: boolean;
}

// https://pocketbase.io/docs/collections/#view-collection
export interface ViewCollectionRecord {
	id: string;
}

// utilities

type MaybeArray<T> = T | T[];

// ===== _mfas =====

export interface MfasResponse extends BaseCollectionResponse {
	collectionName: '_mfas';
	id: string;
	collectionRef: string;
	recordRef: string;
	method: string;
	created: string;
	updated: string;
}

export interface MfasCreate extends BaseCollectionCreate {
	id?: string;
	collectionRef: string;
	recordRef: string;
	method: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface MfasUpdate extends BaseCollectionUpdate {
	id: string;
	collectionRef: string;
	recordRef: string;
	method: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface MfasCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_mfas';
	response: MfasResponse;
	create: MfasCreate;
	update: MfasUpdate;
	relations: Record<string, never>;
}

// ===== _otps =====

export interface OtpsResponse extends BaseCollectionResponse {
	collectionName: '_otps';
	id: string;
	collectionRef: string;
	recordRef: string;
	created: string;
	updated: string;
}

export interface OtpsCreate extends BaseCollectionCreate {
	id?: string;
	collectionRef: string;
	recordRef: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface OtpsUpdate extends BaseCollectionUpdate {
	id: string;
	collectionRef: string;
	recordRef: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface OtpsCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_otps';
	response: OtpsResponse;
	create: OtpsCreate;
	update: OtpsUpdate;
	relations: Record<string, never>;
}

// ===== _externalAuths =====

export interface ExternalAuthsResponse extends BaseCollectionResponse {
	collectionName: '_externalAuths';
	id: string;
	collectionRef: string;
	recordRef: string;
	provider: string;
	providerId: string;
	created: string;
	updated: string;
}

export interface ExternalAuthsCreate extends BaseCollectionCreate {
	id?: string;
	collectionRef: string;
	recordRef: string;
	provider: string;
	providerId: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface ExternalAuthsUpdate extends BaseCollectionUpdate {
	id: string;
	collectionRef: string;
	recordRef: string;
	provider: string;
	providerId: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface ExternalAuthsCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_externalAuths';
	response: ExternalAuthsResponse;
	create: ExternalAuthsCreate;
	update: ExternalAuthsUpdate;
	relations: Record<string, never>;
}

// ===== _authOrigins =====

export interface AuthOriginsResponse extends BaseCollectionResponse {
	collectionName: '_authOrigins';
	id: string;
	collectionRef: string;
	recordRef: string;
	fingerprint: string;
	created: string;
	updated: string;
}

export interface AuthOriginsCreate extends BaseCollectionCreate {
	id?: string;
	collectionRef: string;
	recordRef: string;
	fingerprint: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface AuthOriginsUpdate extends BaseCollectionUpdate {
	id: string;
	collectionRef: string;
	recordRef: string;
	fingerprint: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface AuthOriginsCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_authOrigins';
	response: AuthOriginsResponse;
	create: AuthOriginsCreate;
	update: AuthOriginsUpdate;
	relations: Record<string, never>;
}

// ===== _superusers =====

export interface SuperusersResponse extends AuthCollectionResponse {
	collectionName: '_superusers';
	id: string;
	tokenKey: string;
	email: string;
	emailVisibility: boolean;
	verified: boolean;
	created: string;
	updated: string;
}

export interface SuperusersCreate extends AuthCollectionCreate {
	id?: string;
	email: string;
	emailVisibility?: boolean;
	verified?: boolean;
	created?: string | Date;
	updated?: string | Date;
}

export interface SuperusersUpdate extends AuthCollectionUpdate {
	id: string;
	email: string;
	emailVisibility?: boolean;
	verified?: boolean;
	created?: string | Date;
	updated?: string | Date;
}

export interface SuperusersCollection {
	type: 'auth';
	collectionId: string;
	collectionName: '_superusers';
	response: SuperusersResponse;
	create: SuperusersCreate;
	update: SuperusersUpdate;
	relations: Record<string, never>;
}

// ===== users =====

export interface UsersResponse extends AuthCollectionResponse {
	collectionName: 'users';
	id: string;
	tokenKey: string;
	email: string;
	emailVisibility: boolean;
	verified: boolean;
	name: string;
	avatar: string;
	avatarUrl: string;
	created: string;
	updated: string;
}

export interface UsersCreate extends AuthCollectionCreate {
	id?: string;
	email?: string;
	emailVisibility?: boolean;
	verified?: boolean;
	name?: string;
	avatar?: File | null;
	avatarUrl?: string | URL;
	created?: string | Date;
	updated?: string | Date;
}

export interface UsersUpdate extends AuthCollectionUpdate {
	id: string;
	email?: string;
	emailVisibility?: boolean;
	verified?: boolean;
	name?: string;
	avatar?: File | null;
	avatarUrl?: string | URL;
	created?: string | Date;
	updated?: string | Date;
}

export interface UsersCollection {
	type: 'auth';
	collectionId: string;
	collectionName: 'users';
	response: UsersResponse;
	create: UsersCreate;
	update: UsersUpdate;
	relations: {
		watchlist_via_user_id: WatchlistCollection[];
		watchlist_likes_via_user_id: WatchlistLikesCollection[];
		watchlist_items_via_added_by: WatchlistItemsCollection[];
		watched_list_via_user_id: WatchedListCollection[];
		follows_via_follower_id: FollowsCollection[];
		follows_via_following_id: FollowsCollection[];
		user_profiles_via_user_id: UserProfilesCollection[];
		notifications_via_recipient_id: NotificationsCollection[];
		notifications_via_sender_id: NotificationsCollection[];
	};
}

// ===== _secrets =====

export interface SecretsResponse extends BaseCollectionResponse {
	collectionName: '_secrets';
	id: string;
	name: string;
	value: string;
	created: string;
	updated: string;
}

export interface SecretsCreate extends BaseCollectionCreate {
	id?: string;
	name?: string;
	value?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface SecretsUpdate extends BaseCollectionUpdate {
	id: string;
	name?: string;
	value?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface SecretsCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_secrets';
	response: SecretsResponse;
	create: SecretsCreate;
	update: SecretsUpdate;
	relations: Record<string, never>;
}

// ===== watchlist =====

export interface WatchlistResponse extends BaseCollectionResponse {
	collectionName: 'watchlist';
	id: string;
	title: string;
	overview: string;
	user_id: string;
	items: Array<string>;
	visibility: '' | 'public' | 'private' | 'followers_only';
	is_collaborative: boolean;
	created: string;
	updated: string;
}

export interface WatchlistCreate extends BaseCollectionCreate {
	id?: string;
	title?: string;
	overview?: string;
	user_id: string;
	items?: MaybeArray<string>;
	visibility?: '' | 'public' | 'private' | 'followers_only';
	is_collaborative?: boolean;
	created?: string | Date;
	updated?: string | Date;
}

export interface WatchlistUpdate extends BaseCollectionUpdate {
	id: string;
	title?: string;
	overview?: string;
	user_id: string;
	items?: MaybeArray<string>;
	'items+'?: MaybeArray<string>;
	'items-'?: MaybeArray<string>;
	visibility?: '' | 'public' | 'private' | 'followers_only';
	is_collaborative?: boolean;
	created?: string | Date;
	updated?: string | Date;
}

export interface WatchlistCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'watchlist';
	response: WatchlistResponse;
	create: WatchlistCreate;
	update: WatchlistUpdate;
	relations: {
		user_id: UsersCollection[];
		items: WatchlistItemsCollection[];
	};
}

// ===== watchlist_likes =====

export interface WatchlistLikesResponse extends BaseCollectionResponse {
	collectionName: 'watchlist_likes';
	id: string;
	user_id: string;
	watchlist_item_id: string;
	created: string;
	updated: string;
}

export interface WatchlistLikesCreate extends BaseCollectionCreate {
	id?: string;
	user_id: string;
	watchlist_item_id: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface WatchlistLikesUpdate extends BaseCollectionUpdate {
	id: string;
	user_id: string;
	watchlist_item_id: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface WatchlistLikesCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'watchlist_likes';
	response: WatchlistLikesResponse;
	create: WatchlistLikesCreate;
	update: WatchlistLikesUpdate;
	relations: {
		user_id: UsersCollection[];
		watchlist_item_id: WatchlistItemsCollection;
	};
}

// ===== watchlist_items =====

export interface WatchlistItemsResponse extends BaseCollectionResponse {
	collectionName: 'watchlist_items';
	id: string;
	tmdb_id: number;
	title: string;
	overview: string;
	poster_path: string;
	backdrop_path: string;
	release_date: string;
	vote_average: number;
	genre_ids?: WatchlistItemsGenre_ids
	media_type: 'movie' | 'tv';
	added_by: string;
	personal_rating: number;
	notes: string;
	created: string;
	updated: string;
}

export interface WatchlistItemsCreate extends BaseCollectionCreate {
	id?: string;
	tmdb_id: number;
	title: string;
	overview?: string;
	poster_path?: string;
	backdrop_path?: string;
	release_date?: string | Date;
	vote_average?: number;
	genre_ids?: WatchlistItemsGenre_ids
	media_type: 'movie' | 'tv';
	added_by: string;
	personal_rating?: number;
	notes?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface WatchlistItemsUpdate extends BaseCollectionUpdate {
	id: string;
	tmdb_id: number;
	'tmdb_id+'?: number;
	'tmdb_id-'?: number;
	title: string;
	overview?: string;
	poster_path?: string;
	backdrop_path?: string;
	release_date?: string | Date;
	vote_average?: number;
	'vote_average+'?: number;
	'vote_average-'?: number;
	genre_ids?: WatchlistItemsGenre_ids
	media_type: 'movie' | 'tv';
	added_by: string;
	personal_rating?: number;
	'personal_rating+'?: number;
	'personal_rating-'?: number;
	notes?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface WatchlistItemsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'watchlist_items';
	response: WatchlistItemsResponse;
	create: WatchlistItemsCreate;
	update: WatchlistItemsUpdate;
	relations: {
		watchlist_via_items: WatchlistCollection[];
		watchlist_likes_via_watchlist_item_id: WatchlistLikesCollection[];
		added_by: UsersCollection[];
		watched_list_via_items: WatchedListCollection[];
	};
}

// ===== watched_list =====

export interface WatchedListResponse extends BaseCollectionResponse {
	collectionName: 'watched_list';
	id: string;
	user_id: string;
	items: Array<string>;
	field: Array<'happy' | 'sad' | 'anxious' | 'sorry'>;
	created: string;
	updated: string;
}

export interface WatchedListCreate extends BaseCollectionCreate {
	id?: string;
	user_id: string;
	items?: MaybeArray<string>;
	field?: MaybeArray<'happy' | 'sad' | 'anxious' | 'sorry'>;
	created?: string | Date;
	updated?: string | Date;
}

export interface WatchedListUpdate extends BaseCollectionUpdate {
	id: string;
	user_id: string;
	items?: MaybeArray<string>;
	'items+'?: MaybeArray<string>;
	'items-'?: MaybeArray<string>;
	field?: MaybeArray<'happy' | 'sad' | 'anxious' | 'sorry'>;
	'field+'?: MaybeArray<'happy' | 'sad' | 'anxious' | 'sorry'>;
	'field-'?: MaybeArray<'happy' | 'sad' | 'anxious' | 'sorry'>;
	created?: string | Date;
	updated?: string | Date;
}

export interface WatchedListCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'watched_list';
	response: WatchedListResponse;
	create: WatchedListCreate;
	update: WatchedListUpdate;
	relations: {
		user_id: UsersCollection[];
		items: WatchlistItemsCollection[];
	};
}

// ===== follows =====

export interface FollowsResponse extends BaseCollectionResponse {
	collectionName: 'follows';
	id: string;
	follower_id: string;
	following_id: string;
	status: '' | 'pending' | 'accepted' | 'blocked';
	created: string;
	updated: string;
}

export interface FollowsCreate extends BaseCollectionCreate {
	id?: string;
	follower_id: string;
	following_id: string;
	status?: '' | 'pending' | 'accepted' | 'blocked';
	created?: string | Date;
	updated?: string | Date;
}

export interface FollowsUpdate extends BaseCollectionUpdate {
	id: string;
	follower_id: string;
	following_id: string;
	status?: '' | 'pending' | 'accepted' | 'blocked';
	created?: string | Date;
	updated?: string | Date;
}

export interface FollowsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'follows';
	response: FollowsResponse;
	create: FollowsCreate;
	update: FollowsUpdate;
	relations: {
		follower_id: UsersCollection[];
		following_id: UsersCollection[];
	};
}

// ===== user_profiles =====

export interface UserProfilesResponse extends BaseCollectionResponse {
	collectionName: 'user_profiles';
	id: string;
	user_id: string;
	bio: string;
	location: string;
	website: string;
	is_private: boolean;
	follower_count: number;
	following_count: number;
	watchlist_count: number;
	created: string;
	updated: string;
}

export interface UserProfilesCreate extends BaseCollectionCreate {
	id?: string;
	user_id: string;
	bio?: string;
	location?: string;
	website?: string | URL;
	is_private?: boolean;
	follower_count?: number;
	following_count?: number;
	watchlist_count?: number;
	created?: string | Date;
	updated?: string | Date;
}

export interface UserProfilesUpdate extends BaseCollectionUpdate {
	id: string;
	user_id: string;
	bio?: string;
	location?: string;
	website?: string | URL;
	is_private?: boolean;
	follower_count?: number;
	'follower_count+'?: number;
	'follower_count-'?: number;
	following_count?: number;
	'following_count+'?: number;
	'following_count-'?: number;
	watchlist_count?: number;
	'watchlist_count+'?: number;
	'watchlist_count-'?: number;
	created?: string | Date;
	updated?: string | Date;
}

export interface UserProfilesCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'user_profiles';
	response: UserProfilesResponse;
	create: UserProfilesCreate;
	update: UserProfilesUpdate;
	relations: {
		user_id: UsersCollection[];
	};
}

// ===== notifications =====

export interface NotificationsResponse extends BaseCollectionResponse {
	collectionName: 'notifications';
	id: string;
	recipient_id: string;
	sender_id: string;
	type: 'follow_request' | 'follow_accepted' | 'watchlist_shared' | 'watchlist_liked';
	message: string;
	is_read: boolean;
	related_id: string;
	created: string;
	updated: string;
}

export interface NotificationsCreate extends BaseCollectionCreate {
	id?: string;
	recipient_id: string;
	sender_id?: string;
	type: 'follow_request' | 'follow_accepted' | 'watchlist_shared' | 'watchlist_liked';
	message?: string;
	is_read?: boolean;
	related_id?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface NotificationsUpdate extends BaseCollectionUpdate {
	id: string;
	recipient_id: string;
	sender_id?: string;
	type: 'follow_request' | 'follow_accepted' | 'watchlist_shared' | 'watchlist_liked';
	message?: string;
	is_read?: boolean;
	related_id?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface NotificationsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'notifications';
	response: NotificationsResponse;
	create: NotificationsCreate;
	update: NotificationsUpdate;
	relations: {
		recipient_id: UsersCollection[];
		sender_id: UsersCollection[];
	};
}

// ===== Schema =====

export type Schema = {
	_mfas: MfasCollection;
	_otps: OtpsCollection;
	_externalAuths: ExternalAuthsCollection;
	_authOrigins: AuthOriginsCollection;
	_superusers: SuperusersCollection;
	users: UsersCollection;
	_secrets: SecretsCollection;
	watchlist: WatchlistCollection;
	watchlist_likes: WatchlistLikesCollection;
	watchlist_items: WatchlistItemsCollection;
	watched_list: WatchedListCollection;
	follows: FollowsCollection;
	user_profiles: UserProfilesCollection;
	notifications: NotificationsCollection;
};