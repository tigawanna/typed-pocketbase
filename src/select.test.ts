import { describe, test, expect } from 'vitest';
import { resolveSelect } from './select.js';
import type { SelectWithExpand } from './select.js';

interface TestCollection {
	type: 'base';
	collectionId: 'test_id';
	collectionName: 'test';
	response: {
		id: string;
		name: string;
		email: string;
		age: number;
		created: string;
		updated: string;
	};
	create: {
		name: string;
		email: string;
		age?: number;
	};
	update: {
		name?: string;
		email?: string;
		age?: number;
	};
	relations: {
		posts: PostCollection[];
		profile: ProfileCollection;
	};
}

interface PostCollection {
	type: 'base';
	collectionId: 'posts_id';
	collectionName: 'posts';
	response: {
		id: string;
		title: string;
		content: string;
		author: string;
	};
	create: {
		title: string;
		content: string;
		author: string;
	};
	update: {
		title?: string;
		content?: string;
		author?: string;
	};
	relations: {
		author: TestCollection;
		comments: CommentCollection[];
	};
}

interface CommentCollection {
	type: 'base';
	collectionId: 'comments_id';
	collectionName: 'comments';
	response: {
		id: string;
		text: string;
		post: string;
		author: string;
	};
	create: {
		text: string;
		post: string;
		author: string;
	};
	update: {
		text?: string;
		post?: string;
		author?: string;
	};
	relations: {
		post: PostCollection;
		author: TestCollection;
	};
}

interface ProfileCollection {
	type: 'base';
	collectionId: 'profile_id';
	collectionName: 'profile';
	response: {
		id: string;
		bio: string;
		avatar: string;
		user: string;
	};
	create: {
		bio: string;
		avatar?: string;
		user: string;
	};
	update: {
		bio?: string;
		avatar?: string;
		user?: string;
	};
	relations: {
		user: TestCollection;
	};
}

describe('resolveSelect', () => {
	test('returns all fields when no select provided', () => {
		const result = resolveSelect(undefined);
		expect(result).toEqual({
			fields: '*',
			expand: ''
		});
	});

	test('returns all fields when empty select provided', () => {
		const result = resolveSelect({});
		expect(result).toEqual({
			fields: '*',
			expand: ''
		});
	});

	test('selects specific fields', () => {
		const select: SelectWithExpand<TestCollection> = {
			id: true,
			name: true,
			email: true
		};
		const result = resolveSelect(select);
		expect(result).toEqual({
			fields: 'id,name,email',
			expand: ''
		});
	});

	test('ignores false fields', () => {
		const select: SelectWithExpand<TestCollection> = {
			id: true,
			name: false,
			email: true
		};
		const result = resolveSelect(select);
		expect(result).toEqual({
			fields: 'id,email',
			expand: ''
		});
	});

	test('handles simple expand with true', () => {
		const select: SelectWithExpand<TestCollection> = {
			id: true,
			name: true,
			expand: {
				profile: true
			}
		};
		const result = resolveSelect(select);
		expect(result).toEqual({
			fields: 'id,name,expand.profile.*',
			expand: 'profile'
		});
	});

	test('handles expand with nested select', () => {
		const select: SelectWithExpand<TestCollection> = {
			id: true,
			name: true,
			expand: {
				profile: {
					id: true,
					bio: true
				}
			}
		};
		const result = resolveSelect(select);
		expect(result).toEqual({
			fields: 'id,name,expand.profile.id,expand.profile.bio',
			expand: 'profile'
		});
	});

	test('handles multiple expands', () => {
		const select: SelectWithExpand<TestCollection> = {
			id: true,
			name: true,
			expand: {
				profile: true,
				posts: {
					id: true,
					title: true
				}
			}
		};
		const result = resolveSelect(select);
		expect(result).toEqual({
			fields: 'id,name,expand.profile.*,expand.posts.id,expand.posts.title',
			expand: 'profile,posts'
		});
	});

	test('handles deeply nested expands', () => {
		const select: SelectWithExpand<TestCollection> = {
			id: true,
			name: true,
			expand: {
				posts: {
					id: true,
					title: true,
					expand: {
						comments: {
							id: true,
							text: true,
							expand: {
								author: {
									id: true,
									name: true
								}
							}
						}
					}
				}
			}
		};
		const result = resolveSelect(select);
		expect(result).toEqual({
			fields: 'id,name,expand.posts.id,expand.posts.title,expand.posts.expand.comments.id,expand.posts.expand.comments.text,expand.posts.expand.comments.expand.author.id,expand.posts.expand.comments.expand.author.name',
			expand: 'posts,posts.comments,posts.comments.author'
		});
	});

	test('handles mixed expand types', () => {
		const select: SelectWithExpand<TestCollection> = {
			expand: {
				profile: true,
				posts: {
					id: true,
					title: true,
					expand: {
						author: true,
						comments: {
							id: true,
							text: true
						}
					}
				}
			}
		};
		const result = resolveSelect(select);
		expect(result).toEqual({
			fields: '*,expand.profile.*,expand.posts.id,expand.posts.title,expand.posts.expand.author.*,expand.posts.expand.comments.id,expand.posts.expand.comments.text',
			expand: 'profile,posts,posts.author,posts.comments'
		});
	});

	test('handles expand with false values', () => {
		const select: SelectWithExpand<TestCollection> = {
			id: true,
			expand: {
				profile: true,
				posts: false
			}
		};
		const result = resolveSelect(select);
		expect(result).toEqual({
			fields: 'id,expand.profile.*',
			expand: 'profile'
		});
	});

	test('handles empty expand object', () => {
		const select: SelectWithExpand<TestCollection> = {
			id: true,
			expand: {}
		};
		const result = resolveSelect(select);
		expect(result).toEqual({
			fields: 'id',
			expand: ''
		});
	});
});