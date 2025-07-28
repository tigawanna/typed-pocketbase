import { z } from 'zod';


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
});

// ===== _mfas =====

export const MfasResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('_mfas'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    method: z.string(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const MfasCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    method: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const MfasUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    method: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== _otps =====

export const OtpsResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('_otps'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const OtpsCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const OtpsUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== _externalAuths =====

export const ExternalAuthsResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('_externalAuths'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    provider: z.string(),
    providerId: z.string(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const ExternalAuthsCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    provider: z.string(),
    providerId: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const ExternalAuthsUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    provider: z.string(),
    providerId: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== _authOrigins =====

export const AuthOriginsResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('_authOrigins'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    fingerprint: z.string(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const AuthOriginsCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    fingerprint: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const AuthOriginsUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    fingerprint: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== _superusers =====

export const SuperusersResponseSchema = authResponseSchema.extend({
    collectionName: z.literal('_superusers'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const SuperusersCreateSchema = authCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const SuperusersUpdateSchema = authUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== users =====

export const UsersResponseSchema = authResponseSchema.extend({
    collectionName: z.literal('users'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email().optional(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    name: z.string().max(255).optional(),
    avatar: z.string().optional(),
    avatarUrl: z.url().optional(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const UsersCreateSchema = authCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email().optional(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    name: z.string().max(255).optional(),
    avatar: z.instanceof(File).nullable().optional(),
    avatarUrl: z.union([z.url(), z.instanceof(URL)]).optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const UsersUpdateSchema = authUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email().optional(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    name: z.string().max(255).optional(),
    avatar: z.instanceof(File).nullable().optional(),
    avatarUrl: z.union([z.url(), z.instanceof(URL)]).optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== _secrets =====

export const SecretsResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('_secrets'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    name: z.string().optional(),
    value: z.string().optional(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const SecretsCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    name: z.string().optional(),
    value: z.string().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const SecretsUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    name: z.string().optional(),
    value: z.string().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== watchlist =====

export const WatchlistResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('watchlist'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    title: z.string().optional(),
    overview: z.string().optional(),
    user_id: z.string(),
    items: z.array(z.string()).optional(),
    visibility: z.enum(['', 'public', 'private', 'followers_only']).optional(),
    is_collaborative: z.boolean().optional(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const WatchlistCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    title: z.string().optional(),
    overview: z.string().optional(),
    user_id: z.string(),
    items: z.union([z.string(), z.array(z.string())]).optional(),
    visibility: z.enum(['', 'public', 'private', 'followers_only']).optional(),
    is_collaborative: z.boolean().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const WatchlistUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    title: z.string().optional(),
    overview: z.string().optional(),
    user_id: z.string(),
    items: z.union([z.string(), z.array(z.string())]).optional(),
    'items+': z.union([z.string(), z.array(z.string())]).optional(),
    'items-': z.union([z.string(), z.array(z.string())]).optional(),
    visibility: z.enum(['', 'public', 'private', 'followers_only']).optional(),
    is_collaborative: z.boolean().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== watchlist_likes =====

export const WatchlistLikesResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('watchlist_likes'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    user_id: z.string(),
    watchlist_item_id: z.string(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const WatchlistLikesCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    user_id: z.string(),
    watchlist_item_id: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const WatchlistLikesUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    user_id: z.string(),
    watchlist_item_id: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== watchlist_items =====

export const WatchlistItemsResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('watchlist_items'),
    id: z.string().min(5).max(15).regex(/^[a-z0-9]+$/).optional(),
    tmdb_id: z.number(),
    title: z.string(),
    overview: z.string().optional(),
    poster_path: z.string().optional(),
    backdrop_path: z.string().optional(),
    release_date: z.string().optional(),
    vote_average: z.number().optional(),
    genre_ids: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    media_type: z.enum(['movie', 'tv']),
    added_by: z.string(),
    personal_rating: z.number().optional(),
    notes: z.string().optional(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const WatchlistItemsCreateSchema = baseCreateSchema.extend({
    id: z.string().min(5).max(15).regex(/^[a-z0-9]+$/).optional(),
    tmdb_id: z.number(),
    title: z.string(),
    overview: z.string().optional(),
    poster_path: z.string().optional(),
    backdrop_path: z.string().optional(),
    release_date: z.union([z.string(), z.date()]).optional(),
    vote_average: z.number().optional(),
    genre_ids: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    media_type: z.enum(['movie', 'tv']),
    added_by: z.string(),
    personal_rating: z.number().optional(),
    notes: z.string().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const WatchlistItemsUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(5).max(15).regex(/^[a-z0-9]+$/).optional(),
    tmdb_id: z.number(),
    'tmdb_id+': z.number().optional(),
    'tmdb_id-': z.number().optional(),
    title: z.string(),
    overview: z.string().optional(),
    poster_path: z.string().optional(),
    backdrop_path: z.string().optional(),
    release_date: z.union([z.string(), z.date()]).optional(),
    vote_average: z.number().optional(),
    'vote_average+': z.number().optional(),
    'vote_average-': z.number().optional(),
    genre_ids: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    media_type: z.enum(['movie', 'tv']),
    added_by: z.string(),
    personal_rating: z.number().optional(),
    'personal_rating+': z.number().optional(),
    'personal_rating-': z.number().optional(),
    notes: z.string().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== watched_list =====

export const WatchedListResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('watched_list'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    user_id: z.string(),
    items: z.array(z.string()).optional(),
    field: z.array(z.enum(['happy', 'sad', 'anxious', 'sorry'])).optional(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const WatchedListCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    user_id: z.string(),
    items: z.union([z.string(), z.array(z.string())]).optional(),
    field: z.union([z.enum(['happy', 'sad', 'anxious', 'sorry']), z.array(z.enum(['happy', 'sad', 'anxious', 'sorry']))]).optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const WatchedListUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    user_id: z.string(),
    items: z.union([z.string(), z.array(z.string())]).optional(),
    'items+': z.union([z.string(), z.array(z.string())]).optional(),
    'items-': z.union([z.string(), z.array(z.string())]).optional(),
    field: z.union([z.enum(['happy', 'sad', 'anxious', 'sorry']), z.array(z.enum(['happy', 'sad', 'anxious', 'sorry']))]).optional(),
    'field+': z.union([z.enum(['happy', 'sad', 'anxious', 'sorry']), z.array(z.enum(['happy', 'sad', 'anxious', 'sorry']))]).optional(),
    'field-': z.union([z.enum(['happy', 'sad', 'anxious', 'sorry']), z.array(z.enum(['happy', 'sad', 'anxious', 'sorry']))]).optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== follows =====

export const FollowsResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('follows'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    follower_id: z.string(),
    following_id: z.string(),
    status: z.enum(['', 'pending', 'accepted', 'blocked']).optional(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const FollowsCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    follower_id: z.string(),
    following_id: z.string(),
    status: z.enum(['', 'pending', 'accepted', 'blocked']).optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const FollowsUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    follower_id: z.string(),
    following_id: z.string(),
    status: z.enum(['', 'pending', 'accepted', 'blocked']).optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== user_profiles =====

export const UserProfilesResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('user_profiles'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    user_id: z.string(),
    bio: z.string().optional(),
    location: z.string().optional(),
    website: z.url().optional(),
    is_private: z.boolean().optional(),
    follower_count: z.number().optional(),
    following_count: z.number().optional(),
    watchlist_count: z.number().optional(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const UserProfilesCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    user_id: z.string(),
    bio: z.string().optional(),
    location: z.string().optional(),
    website: z.union([z.url(), z.instanceof(URL)]).optional(),
    is_private: z.boolean().optional(),
    follower_count: z.number().optional(),
    following_count: z.number().optional(),
    watchlist_count: z.number().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const UserProfilesUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    user_id: z.string(),
    bio: z.string().optional(),
    location: z.string().optional(),
    website: z.union([z.url(), z.instanceof(URL)]).optional(),
    is_private: z.boolean().optional(),
    follower_count: z.number().optional(),
    'follower_count+': z.number().optional(),
    'follower_count-': z.number().optional(),
    following_count: z.number().optional(),
    'following_count+': z.number().optional(),
    'following_count-': z.number().optional(),
    watchlist_count: z.number().optional(),
    'watchlist_count+': z.number().optional(),
    'watchlist_count-': z.number().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== notifications =====

export const NotificationsResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('notifications'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    recipient_id: z.string(),
    sender_id: z.string().optional(),
    type: z.enum(['follow_request', 'follow_accepted', 'watchlist_shared', 'watchlist_liked']),
    message: z.string().optional(),
    is_read: z.boolean().optional(),
    related_id: z.string().optional(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const NotificationsCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    recipient_id: z.string(),
    sender_id: z.string().optional(),
    type: z.enum(['follow_request', 'follow_accepted', 'watchlist_shared', 'watchlist_liked']),
    message: z.string().optional(),
    is_read: z.boolean().optional(),
    related_id: z.string().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const NotificationsUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    recipient_id: z.string(),
    sender_id: z.string().optional(),
    type: z.enum(['follow_request', 'follow_accepted', 'watchlist_shared', 'watchlist_liked']),
    message: z.string().optional(),
    is_read: z.boolean().optional(),
    related_id: z.string().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});


// Export all schemas
export const schemas = {
    _mfas: {
        response: MfasResponseSchema,
        create: MfasCreateSchema,
        update: MfasUpdateSchema,
    },
    _otps: {
        response: OtpsResponseSchema,
        create: OtpsCreateSchema,
        update: OtpsUpdateSchema,
    },
    _externalAuths: {
        response: ExternalAuthsResponseSchema,
        create: ExternalAuthsCreateSchema,
        update: ExternalAuthsUpdateSchema,
    },
    _authOrigins: {
        response: AuthOriginsResponseSchema,
        create: AuthOriginsCreateSchema,
        update: AuthOriginsUpdateSchema,
    },
    _superusers: {
        response: SuperusersResponseSchema,
        create: SuperusersCreateSchema,
        update: SuperusersUpdateSchema,
    },
    users: {
        response: UsersResponseSchema,
        create: UsersCreateSchema,
        update: UsersUpdateSchema,
    },
    _secrets: {
        response: SecretsResponseSchema,
        create: SecretsCreateSchema,
        update: SecretsUpdateSchema,
    },
    watchlist: {
        response: WatchlistResponseSchema,
        create: WatchlistCreateSchema,
        update: WatchlistUpdateSchema,
    },
    watchlist_likes: {
        response: WatchlistLikesResponseSchema,
        create: WatchlistLikesCreateSchema,
        update: WatchlistLikesUpdateSchema,
    },
    watchlist_items: {
        response: WatchlistItemsResponseSchema,
        create: WatchlistItemsCreateSchema,
        update: WatchlistItemsUpdateSchema,
    },
    watched_list: {
        response: WatchedListResponseSchema,
        create: WatchedListCreateSchema,
        update: WatchedListUpdateSchema,
    },
    follows: {
        response: FollowsResponseSchema,
        create: FollowsCreateSchema,
        update: FollowsUpdateSchema,
    },
    user_profiles: {
        response: UserProfilesResponseSchema,
        create: UserProfilesCreateSchema,
        update: UserProfilesUpdateSchema,
    },
    notifications: {
        response: NotificationsResponseSchema,
        create: NotificationsCreateSchema,
        update: NotificationsUpdateSchema,
    },
};

export type Schemas = typeof schemas;

// Validation helpers
// Validation helpers for _mfas
export const _mfasValidators = {
    response: (data: unknown) => MfasResponseSchema.parse(data),
    safeResponse: (data: unknown) => MfasResponseSchema.safeParse(data),
    create: (data: unknown) => MfasCreateSchema.parse(data),
    safeCreate: (data: unknown) => MfasCreateSchema.safeParse(data),
    update: (data: unknown) => MfasUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => MfasUpdateSchema.safeParse(data),
};

// Type inference helpers for _mfas
export type MfasResponse = z.infer<typeof MfasResponseSchema>;
export type MfasCreate = z.infer<typeof MfasCreateSchema>;
export type MfasUpdate = z.infer<typeof MfasUpdateSchema>;

// Validation helpers for _otps
export const _otpsValidators = {
    response: (data: unknown) => OtpsResponseSchema.parse(data),
    safeResponse: (data: unknown) => OtpsResponseSchema.safeParse(data),
    create: (data: unknown) => OtpsCreateSchema.parse(data),
    safeCreate: (data: unknown) => OtpsCreateSchema.safeParse(data),
    update: (data: unknown) => OtpsUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => OtpsUpdateSchema.safeParse(data),
};

// Type inference helpers for _otps
export type OtpsResponse = z.infer<typeof OtpsResponseSchema>;
export type OtpsCreate = z.infer<typeof OtpsCreateSchema>;
export type OtpsUpdate = z.infer<typeof OtpsUpdateSchema>;

// Validation helpers for _externalAuths
export const _externalAuthsValidators = {
    response: (data: unknown) => ExternalAuthsResponseSchema.parse(data),
    safeResponse: (data: unknown) => ExternalAuthsResponseSchema.safeParse(data),
    create: (data: unknown) => ExternalAuthsCreateSchema.parse(data),
    safeCreate: (data: unknown) => ExternalAuthsCreateSchema.safeParse(data),
    update: (data: unknown) => ExternalAuthsUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => ExternalAuthsUpdateSchema.safeParse(data),
};

// Type inference helpers for _externalAuths
export type ExternalAuthsResponse = z.infer<typeof ExternalAuthsResponseSchema>;
export type ExternalAuthsCreate = z.infer<typeof ExternalAuthsCreateSchema>;
export type ExternalAuthsUpdate = z.infer<typeof ExternalAuthsUpdateSchema>;

// Validation helpers for _authOrigins
export const _authOriginsValidators = {
    response: (data: unknown) => AuthOriginsResponseSchema.parse(data),
    safeResponse: (data: unknown) => AuthOriginsResponseSchema.safeParse(data),
    create: (data: unknown) => AuthOriginsCreateSchema.parse(data),
    safeCreate: (data: unknown) => AuthOriginsCreateSchema.safeParse(data),
    update: (data: unknown) => AuthOriginsUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => AuthOriginsUpdateSchema.safeParse(data),
};

// Type inference helpers for _authOrigins
export type AuthOriginsResponse = z.infer<typeof AuthOriginsResponseSchema>;
export type AuthOriginsCreate = z.infer<typeof AuthOriginsCreateSchema>;
export type AuthOriginsUpdate = z.infer<typeof AuthOriginsUpdateSchema>;

// Validation helpers for _superusers
export const _superusersValidators = {
    response: (data: unknown) => SuperusersResponseSchema.parse(data),
    safeResponse: (data: unknown) => SuperusersResponseSchema.safeParse(data),
    create: (data: unknown) => SuperusersCreateSchema.parse(data),
    safeCreate: (data: unknown) => SuperusersCreateSchema.safeParse(data),
    update: (data: unknown) => SuperusersUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => SuperusersUpdateSchema.safeParse(data),
};

// Type inference helpers for _superusers
export type SuperusersResponse = z.infer<typeof SuperusersResponseSchema>;
export type SuperusersCreate = z.infer<typeof SuperusersCreateSchema>;
export type SuperusersUpdate = z.infer<typeof SuperusersUpdateSchema>;

// Validation helpers for users
export const usersValidators = {
    response: (data: unknown) => UsersResponseSchema.parse(data),
    safeResponse: (data: unknown) => UsersResponseSchema.safeParse(data),
    create: (data: unknown) => UsersCreateSchema.parse(data),
    safeCreate: (data: unknown) => UsersCreateSchema.safeParse(data),
    update: (data: unknown) => UsersUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => UsersUpdateSchema.safeParse(data),
};

// Type inference helpers for users
export type UsersResponse = z.infer<typeof UsersResponseSchema>;
export type UsersCreate = z.infer<typeof UsersCreateSchema>;
export type UsersUpdate = z.infer<typeof UsersUpdateSchema>;

// Validation helpers for _secrets
export const _secretsValidators = {
    response: (data: unknown) => SecretsResponseSchema.parse(data),
    safeResponse: (data: unknown) => SecretsResponseSchema.safeParse(data),
    create: (data: unknown) => SecretsCreateSchema.parse(data),
    safeCreate: (data: unknown) => SecretsCreateSchema.safeParse(data),
    update: (data: unknown) => SecretsUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => SecretsUpdateSchema.safeParse(data),
};

// Type inference helpers for _secrets
export type SecretsResponse = z.infer<typeof SecretsResponseSchema>;
export type SecretsCreate = z.infer<typeof SecretsCreateSchema>;
export type SecretsUpdate = z.infer<typeof SecretsUpdateSchema>;

// Validation helpers for watchlist
export const watchlistValidators = {
    response: (data: unknown) => WatchlistResponseSchema.parse(data),
    safeResponse: (data: unknown) => WatchlistResponseSchema.safeParse(data),
    create: (data: unknown) => WatchlistCreateSchema.parse(data),
    safeCreate: (data: unknown) => WatchlistCreateSchema.safeParse(data),
    update: (data: unknown) => WatchlistUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => WatchlistUpdateSchema.safeParse(data),
};

// Type inference helpers for watchlist
export type WatchlistResponse = z.infer<typeof WatchlistResponseSchema>;
export type WatchlistCreate = z.infer<typeof WatchlistCreateSchema>;
export type WatchlistUpdate = z.infer<typeof WatchlistUpdateSchema>;

// Validation helpers for watchlist_likes
export const watchlist_likesValidators = {
    response: (data: unknown) => WatchlistLikesResponseSchema.parse(data),
    safeResponse: (data: unknown) => WatchlistLikesResponseSchema.safeParse(data),
    create: (data: unknown) => WatchlistLikesCreateSchema.parse(data),
    safeCreate: (data: unknown) => WatchlistLikesCreateSchema.safeParse(data),
    update: (data: unknown) => WatchlistLikesUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => WatchlistLikesUpdateSchema.safeParse(data),
};

// Type inference helpers for watchlist_likes
export type WatchlistLikesResponse = z.infer<typeof WatchlistLikesResponseSchema>;
export type WatchlistLikesCreate = z.infer<typeof WatchlistLikesCreateSchema>;
export type WatchlistLikesUpdate = z.infer<typeof WatchlistLikesUpdateSchema>;

// Validation helpers for watchlist_items
export const watchlist_itemsValidators = {
    response: (data: unknown) => WatchlistItemsResponseSchema.parse(data),
    safeResponse: (data: unknown) => WatchlistItemsResponseSchema.safeParse(data),
    create: (data: unknown) => WatchlistItemsCreateSchema.parse(data),
    safeCreate: (data: unknown) => WatchlistItemsCreateSchema.safeParse(data),
    update: (data: unknown) => WatchlistItemsUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => WatchlistItemsUpdateSchema.safeParse(data),
};

// Type inference helpers for watchlist_items
export type WatchlistItemsResponse = z.infer<typeof WatchlistItemsResponseSchema>;
export type WatchlistItemsCreate = z.infer<typeof WatchlistItemsCreateSchema>;
export type WatchlistItemsUpdate = z.infer<typeof WatchlistItemsUpdateSchema>;

// Validation helpers for watched_list
export const watched_listValidators = {
    response: (data: unknown) => WatchedListResponseSchema.parse(data),
    safeResponse: (data: unknown) => WatchedListResponseSchema.safeParse(data),
    create: (data: unknown) => WatchedListCreateSchema.parse(data),
    safeCreate: (data: unknown) => WatchedListCreateSchema.safeParse(data),
    update: (data: unknown) => WatchedListUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => WatchedListUpdateSchema.safeParse(data),
};

// Type inference helpers for watched_list
export type WatchedListResponse = z.infer<typeof WatchedListResponseSchema>;
export type WatchedListCreate = z.infer<typeof WatchedListCreateSchema>;
export type WatchedListUpdate = z.infer<typeof WatchedListUpdateSchema>;

// Validation helpers for follows
export const followsValidators = {
    response: (data: unknown) => FollowsResponseSchema.parse(data),
    safeResponse: (data: unknown) => FollowsResponseSchema.safeParse(data),
    create: (data: unknown) => FollowsCreateSchema.parse(data),
    safeCreate: (data: unknown) => FollowsCreateSchema.safeParse(data),
    update: (data: unknown) => FollowsUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => FollowsUpdateSchema.safeParse(data),
};

// Type inference helpers for follows
export type FollowsResponse = z.infer<typeof FollowsResponseSchema>;
export type FollowsCreate = z.infer<typeof FollowsCreateSchema>;
export type FollowsUpdate = z.infer<typeof FollowsUpdateSchema>;

// Validation helpers for user_profiles
export const user_profilesValidators = {
    response: (data: unknown) => UserProfilesResponseSchema.parse(data),
    safeResponse: (data: unknown) => UserProfilesResponseSchema.safeParse(data),
    create: (data: unknown) => UserProfilesCreateSchema.parse(data),
    safeCreate: (data: unknown) => UserProfilesCreateSchema.safeParse(data),
    update: (data: unknown) => UserProfilesUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => UserProfilesUpdateSchema.safeParse(data),
};

// Type inference helpers for user_profiles
export type UserProfilesResponse = z.infer<typeof UserProfilesResponseSchema>;
export type UserProfilesCreate = z.infer<typeof UserProfilesCreateSchema>;
export type UserProfilesUpdate = z.infer<typeof UserProfilesUpdateSchema>;

// Validation helpers for notifications
export const notificationsValidators = {
    response: (data: unknown) => NotificationsResponseSchema.parse(data),
    safeResponse: (data: unknown) => NotificationsResponseSchema.safeParse(data),
    create: (data: unknown) => NotificationsCreateSchema.parse(data),
    safeCreate: (data: unknown) => NotificationsCreateSchema.safeParse(data),
    update: (data: unknown) => NotificationsUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => NotificationsUpdateSchema.safeParse(data),
};

// Type inference helpers for notifications
export type NotificationsResponse = z.infer<typeof NotificationsResponseSchema>;
export type NotificationsCreate = z.infer<typeof NotificationsCreateSchema>;
export type NotificationsUpdate = z.infer<typeof NotificationsUpdateSchema>;