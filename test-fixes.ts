// Test file to verify our fixes
import { CollectionField } from 'pocketbase';
import { getFieldType } from './src/codegen/utils/field-helpers.js';
import { Columns } from './src/codegen/utils/util-types.js';

// Test the update type fix
const testField: CollectionField = {
    name: 'title',
    type: 'text',
    required: true,
    hidden: false,
    system: false,
    presentable: false,
    id: '123',
    options: {}
};

const columns: Columns = {
    response: [],
    create: [],
    update: []
};

// This should now make 'title' optional in update operations
getFieldType(testField, columns);

console.log('Update columns:', columns.update);
// Expected: ["title?: string;"] (not "title: string;")

// Test required field
const testRequiredField: CollectionField = {
    name: 'user_id',
    type: 'relation',
    required: true,
    hidden: false,
    system: false,
    presentable: false,
    id: '456',
    options: {},
    maxSelect: 1
};

const columns2: Columns = {
    response: [],
    create: [],
    update: []
};

getFieldType(testRequiredField, columns2);

console.log('Update columns for required field:', columns2.update);
// Expected: ["user_id?: string;"] (not "user_id: string;")
