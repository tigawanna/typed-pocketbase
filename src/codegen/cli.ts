import { Command } from 'commander';
import { generateTypes } from './index.js';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { checkAndCreateNestsedDir, readOrCreateFile } from './utils/fs.js';
import {
	getCustomTypes,
	modifyAndInjectCustomSTypes
} from './modiiers/custom-type-generation.js';
import { filterByCollection } from './modiiers/filter-collections.js';

// Import package.json for version and name
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
	readFileSync(join(__dirname, '../../package.json'), 'utf8')
);

interface CliOptions {
	url?: string;
	email?: string;
	password?: string;
	dir?: string;
	filter?: string;
	ignore?: string;
	include?: string;
	type?: string; // 'zod' or 'ts' or 'ts,zod' for thoth
}

const program = new Command();

program
	.name(packageJson.name)
	.version(packageJson.version)
	.description('Generate types for the PocketBase JavaScript SDK')
	.option(
		'-u, --url <url>',
		'URL to your hosted pocketbase instance',
		'http://127.0.0.1:8090'
	)
	.option(
		'-e, --email <email>',
		'email for an admin pocketbase user',
		process.env.POCKETBASE_EMAIL
	)
	.option(
		'-p, --password <password>',
		'password for an admin pocketbase user',
		process.env.POCKETBASE_PASSWORD
	)
	.option(
		'-d, --dir <directory>',
		'directory path to save the typescript files'
	)
	.option(
		'-f, --filter <filter>',
		'only generate types from specified collection',
		''
	)
	.option(
		'-t, --type <type>',
		'output type of the generated types, either "zod" or "ts" or "ts,zod"',
		'ts'
	)

	.option('--ignore <pattern>', 'regex pattern to ignore collections ', '')
	.option('--include <pattern>', 'regex pattern to include collections', '')
	.action(async (options: CliOptions) => {
		if (!options.url) {
			// console.log("url", options.url);
			error(`required option '-u, --url' not specified`);
		}

		if (!options.email) {
			error(
				`required option '-e, --email' not specified and 'POCKETBASE_EMAIL' env not set`
			);
		}

		if (!options.password) {
			error(
				`required option '-p, --password' not specified and 'POCKETBASE_PASSWORD' env not set`
			);
		}

		const { types: raw_typed_pb_types, zodSchemas } = await generateTypes({
			url: options.url,
			email: options.email,
			password: options.password,
			ignorePattern: options.ignore,
			includePattern: options.include
		});

		if (options.dir) {
			const [optA, optB] = options.type?.split(',') || ['ts'];

			// Validate options - optB can be undefined for single options
			const validOptions = ['ts', 'zod'];
			if (
				!validOptions.includes(optA) ||
				(optB && !validOptions.includes(optB))
			) {
				error(
					`Invalid type option. Use 'ts', 'zod' or 'ts,zod'. Provided: ${options.type}`
				);
			}
			const DEFAULT_PB_FILES_DIR = resolve(options.dir);
			await checkAndCreateNestsedDir(DEFAULT_PB_FILES_DIR);
			const PB_TYPES_PATH = resolve(DEFAULT_PB_FILES_DIR, 'pb-types.ts');
			const PB_ZOD_PATH = resolve(DEFAULT_PB_FILES_DIR, 'pb-zod.ts');
			const CUSTOM_PB_TYPES_PATH = resolve(
				DEFAULT_PB_FILES_DIR,
				'custom-pb-types.ts'
			);

			if (optA === 'ts' || optB === 'ts') {
				const text_output = raw_typed_pb_types;

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

				await writeFile(PB_TYPES_PATH, final_db_types, 'utf-8');
				console.log(`Generated types for PocketBase at ${PB_TYPES_PATH}`);
				console.log(' ====>', final_db_types.split('// ===== Schema =====')[1]);
			}
			if (optB === 'zod' || optA === 'zod') {
				await writeFile(PB_ZOD_PATH, zodSchemas, 'utf-8');
				console.log(
					`Generated Zod schemas for PocketBase at ${PB_ZOD_PATH} \n\n ${zodSchemas}`
				);
			}
		} else {
			console.log(raw_typed_pb_types);
		}
	});

program.parse();

function error(msg: string): never {
	console.error(msg);
	process.exit(1);
}
