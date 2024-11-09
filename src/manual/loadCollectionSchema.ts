import { generateTypes } from '../codegen/index.js';
import { config as dotenvConfig } from 'dotenv';
import { filterByCollection } from '../codegen/modiiers/filter-collections.js';
import { modifyAndInjectCustomSTypes } from '../codegen/modiiers/custom-type-generation.js';
dotenvConfig();

const url = process.env.VITE_PB_URL ?? 'http://127.0.0.1:8090';
const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL ?? '';
const PB_ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD ?? '';
// loadCollectionSchema();
export async function loadCollectionSchema() {
    return await generateTypes({
        url,
        email: PB_ADMIN_EMAIL,
        password: PB_ADMIN_PASSWORD
    });
}

function runFunction() {
    loadCollectionSchema()
        .then((res) => {
            filterByCollection(res, "buff").then((res) => {
                const finalTypes = modifyAndInjectCustomSTypes({
                    content: res.text_output,
                    extracted_custom_db_types: "",
                    extracted_custom_db_types_array: []
                })
                console.log(" ====>", finalTypes.split("// ===== Schema =====")[1])
                console.log(" =========>", finalTypes)
            })
        })
        .catch((err) => {
            console.log(err);
        });
}

runFunction();
