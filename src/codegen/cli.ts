import sade from 'sade';
import { generateTypes } from './index.js';
import {  writeFile } from 'node:fs/promises';
import {  resolve } from 'node:path';
import { checkAndCreateNestsedDir, readOrCreateFile } from './utils/fs.js';
import {
	getCustomTypes,
	modifyAndInjectCustomSTypes
} from './modiiers/custom-type-generation.js';
import { filterByCollection } from './modiiers/filter-collections.js';


interface CliOptions {
	url?: string;
	email?: string;
	password?: string;
	dir?: string;
	filter?: string;
}

sade(PKG_NAME, true)
	.version(PKG_VERSION)
	.describe('Generate types for the PocketBase JavaScript SDK')
	.option(
		'-u, --url',
		'URL to your hosted pocketbase instance.'
	)
	.option('-e, --email', 'email for an admin pocketbase user.')
	.option('-p, --password', 'password for an admin pocketbase user.')
	.option(
		'-d, --dir',
		'directory path to save the typescript (dir/pb-types.ts,dir/custom-pb-types.ts) will be created under that dir'
	)
	.option('-f, --filter', 'only generate types from specified collection')
	.action(
		async ({
			url="http://127.0.0.1:8090",
			email = process.env.POCKETBASE_EMAIL,
			password = process.env.POCKETBASE_PASSWORD,
			dir,
			filter = ''
		}: CliOptions) => {
			console.log({
				url,
				email,
				password,
				dir,
				filter
			})
				
			if (!url){
				console.log("url", url)
				error(`required option '-u, --url' not specified`);
			} 

			if (!email)
				error(
					`required option '-e, --email' not specified and 'POCKETBASE_EMAIL' env not set`
				);

			if (!password)
				error(
					`required option '-p, --password' not specified and 'POCKETBASE_PASSWORD' env not set`
				);

			const raw_typed_pb_types = await generateTypes({
				url,
				email,
				password
			});

			if (dir) {
				const DEFAULT_PB_FILES_DIR = resolve(dir);
				// await mkdir(dirname(DEFAULT_PB_FILES_DIR), {
				// 	recursive: true
				// });
				await checkAndCreateNestsedDir(DEFAULT_PB_FILES_DIR);
				const PB_TYPES_PATH = resolve(DEFAULT_PB_FILES_DIR, 'pb-types.ts');
				const CUSTOM_PB_TYPES_PATH = resolve(
					DEFAULT_PB_FILES_DIR,
					'custom-pb-types.ts'
				);
				const { text_output } = await filterByCollection(raw_typed_pb_types, filter);

				const custom_db_types_string =
					await readOrCreateFile(CUSTOM_PB_TYPES_PATH);
				const { extracted_custom_db_types, extracted_custom_db_types_array } =
					await getCustomTypes(text_output, custom_db_types_string);

				await writeFile(
					CUSTOM_PB_TYPES_PATH,
					extracted_custom_db_types,
					'utf-8'
				);
				const final_db_types = await modifyAndInjectCustomSTypes({
					content: text_output,
					extracted_custom_db_types,
					extracted_custom_db_types_array
				});
				// console.log('final_db_types', final_db_types.slice(filter.length-200));

				await writeFile(PB_TYPES_PATH, final_db_types, 'utf-8');
				console.log(`Generated types for PocketBase at ${PB_TYPES_PATH}`);
				console.log(" ====>", final_db_types.split("// ===== Schema =====")[1])

			} else {
				console.log(raw_typed_pb_types);
			}
		}
	)
	.parse(process.argv);

function error(msg: string): never {
	console.error(msg);
	process.exit();
}
