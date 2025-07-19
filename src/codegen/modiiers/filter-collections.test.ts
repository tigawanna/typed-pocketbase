import { expect, test, describe } from "vitest";
import { filterByCollection } from "./filter-collections.js";

describe("filterByCollection", () => {
    test("filterByCollection with empty string", async () => {
        const filtered = await filterByCollection("");
		expect(filtered.text_output).toStrictEqual("\n");
        expect(filtered.all_block_indexes).toStrictEqual({});
    });
    test("filterByCollection with no collection filter", async () => {
        const filtered = await filterByCollection(dummy_types_with_json_fields);
		const schema_section = filtered.text_output.split("export type Schema")[1]
        expect(filtered.all_block_indexes).toStrictEqual({
          posts: [1, 59],
          comments: [59, 110],
          uwus: [110, 146],
          Schema: [146, 153],
        });
		  expect(schema_section).toContain("posts: PostsCollection;");
          expect(schema_section).toContain("comments: CommentsCollection;");
          expect(schema_section).toContain("uwus: UwusCollection;");

	});
    test("filterByCollection with uwu collection filter", async () => {
        const filtered = await filterByCollection(dummy_types_with_json_fields,"uwu");
		const schema_section = filtered.text_output.split("export type Schema")[1]
        expect(filtered.all_block_indexes).toStrictEqual({
          posts: [1, 59],
          comments: [59, 110],
          uwus: [110, 146],
          Schema: [146, 153],
        });
   		expect(schema_section).toContain("uwus: UwusCollection;");
	});
    test("filterByCollection with uwu collection filter", async () => {
        const filtered = await filterByCollection(dummy_types_with_json_fields,"u");
		const schema_section = filtered.text_output.split("export type Schema")[1]
        expect(filtered.all_block_indexes).toStrictEqual({
          posts: [1, 59],
          comments: [59, 110],
          uwus: [110, 146],
          Schema: [146, 153],
        });
   		expect(schema_section).toContain("uwus: UwusCollection;");
	});
    test("filterByCollection with comment collection filter", async () => {
        const filtered = await filterByCollection(dummy_types_with_json_fields,"comment");
		const schema_section = filtered.text_output.split("export type Schema")[1]
        expect(filtered.all_block_indexes).toStrictEqual({
          posts: [1, 59],
          comments: [59, 110],
          uwus: [110, 146],
          Schema: [146, 153],
        });
      expect(schema_section).toContain("comments: CommentsCollection;");
      expect(schema_section).not.toContain("posts: PostsCollection;");
      expect(schema_section).not.toContain("uwus: UwusCollection;");
	});
});





const dummy_types_with_json_fields = `
// ===== posts =====

export interface PostsResponse extends BaseCollectionResponse {
	collectionName: 'posts';
	id: string;
	body: string;
	image: string;
	canonical: string;
	published_at: string;
	genre: '' | 'cool' | 'chill' | 'meh';
	tags: Record<string, any> | Array<any> | null;
	draft: boolean;
	user: string;
	created: string;
	updated: string;
}

export interface PostsCreate extends BaseCollectionCreate {
	id: string;
	body?: string;
	image?: File | null;
	canonical?: string | URL;
	published_at?: string | Date;
	genre?: '' | 'cool' | 'chill' | 'meh';
	tags?: Record<string, any> | Array<any> | null;
	draft?: boolean;
	user?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface PostsUpdate extends BaseCollectionUpdate {
	id?: string;
	body?: string;
	image?: File | null;
	canonical?: string | URL;
	published_at?: string | Date;
	genre?: '' | 'cool' | 'chill' | 'meh';
	tags?: Record<string, any> | Array<any> | null;
	draft?: boolean;
	user?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface PostsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'posts';
	response: PostsResponse;
	create: PostsCreate;
	update: PostsUpdate;
	relations: {
		user: UsersCollection;
		comments_via_post: CommentsCollection[];
	};
}

// ===== comments =====

export interface CommentsResponse extends BaseCollectionResponse {
	collectionName: 'comments';
	id: string;
	body: string;
	post: string;
	user: string;
	parent: string;
	mango: string;
	created: string;
	updated: string;
}

export interface CommentsCreate extends BaseCollectionCreate {
	id: string;
	body?: string;
	post: string;
	user: string;
	parent?: string;
	mango?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface CommentsUpdate extends BaseCollectionUpdate {
	id?: string;
	body?: string;
	post?: string;
	user?: string;
	parent?: string;
	mango?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface CommentsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'comments';
	response: CommentsResponse;
	create: CommentsCreate;
	update: CommentsUpdate;
	relations: {
		post: PostsCollection;
		user: UsersCollection;
		parent: CommentsCollection;
		comments_via_parent: CommentsCollection[];
	};
}

// ===== uwus =====

export interface UwusResponse extends BaseCollectionResponse {
	collectionName: 'uwus';
	id: string;
	name: string;
	baggage: Record<string, any> | Array<any> | null;
	created: string;
	updated: string;
}

export interface UwusCreate extends BaseCollectionCreate {
	id: string;
	name?: string;
	baggage?: Record<string, any> | Array<any> | null;
	created?: string | Date;
	updated?: string | Date;
}

export interface UwusUpdate extends BaseCollectionUpdate {
	id?: string;
	name?: string;
	baggage?: Record<string, any> | Array<any> | null;
	created?: string | Date;
	updated?: string | Date;
}

export interface UwusCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'uwus';
	response: UwusResponse;
	create: UwusCreate;
	update: UwusUpdate;
}

// ===== Schema =====

export type Schema = {
	posts: PostsCollection;
	comments: CommentsCollection;
	uwus: UwusCollection;
};
`;

