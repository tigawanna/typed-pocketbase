import { addPointsForCustomTypes } from "./custom-type-generation.js";
import { expect, test, describe, } from "vitest";

const dummy_types_with_no_json_fields = `
// ==== start of uwus block =====


export interface UwusResponse extends BaseCollectionResponse {
	collectionName: 'uwus';
	id: string;
	name: string;
	baggage?: UwusBaggage
	created: string;
	updated: string;
}

export interface UwusCreate extends BaseCollectionCreate {
	id: string;
	name?: string;
	baggage?: UwusBaggage
	created?: string | Date;
	updated?: string | Date;
}

export interface UwusUpdate extends BaseCollectionUpdate {
	id?: string;
	name?: string;
	baggage?: UwusBaggage
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
	relations: {
		comments_via_mango: CommentsCollection[];
	};
}

// ==== end of uwus block =====
`;
const dummy_types_with_json_fields = `
// ==== start of uwus block =====


export interface UwusResponse extends BaseCollectionResponse {
	collectionName: 'uwus';
	id: string;
	name: string;
	baggage?: Record<string, any> | Array<any>
	created: string;
	updated: string;
}

export interface UwusCreate extends BaseCollectionCreate {
	id: string;
	name?: string;
	baggage?: Record<string, any> | Array<any>
	created?: string | Date;
	updated?: string | Date;
}

export interface UwusUpdate extends BaseCollectionUpdate {
	id?: string;
	name?: string;
	baggage?: Record<string, any> | Array<any>
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
	relations: {
		comments_via_mango: CommentsCollection[];
	};
}

// ==== end of uwus block =====
`;

describe("custom-type-generation", () => {
  test("addPointsForCustomTypes with no options", () => {
    const { extracted_custom_db_types, extracted_custom_db_types_array } =
      addPointsForCustomTypes("");
    expect(extracted_custom_db_types).toBe("");
    expect(extracted_custom_db_types_array).toStrictEqual([]);
  });
  test("addPointsForCustomTypes with with no json fields", () => {
    const { extracted_custom_db_types, extracted_custom_db_types_array } = addPointsForCustomTypes(
      dummy_types_with_no_json_fields
    );
    expect(extracted_custom_db_types).toBe("");
    expect(extracted_custom_db_types_array).toStrictEqual([]);
  });
  test("addPointsForCustomTypes with with json fields", () => {
    const { extracted_custom_db_types, extracted_custom_db_types_array } = addPointsForCustomTypes(
      dummy_types_with_json_fields
    );
    expect(extracted_custom_db_types).toContain(`=== start of custom type ===`);
    expect(extracted_custom_db_types).toContain(`UwusBaggage`);
    expect(extracted_custom_db_types).toContain(`=== end of custom type ===`);
    expect(extracted_custom_db_types.length).toEqual(139);
    expect(extracted_custom_db_types_array).toStrictEqual([
      {
        target_interface: "UwusResponse",
        field: "baggage",
        new_custom_type: "UwusBaggage",
      },
    ]);
  });
});
