export async function filterByCollection(
	schema_string: string,
	collection_keywords_to_filter = ''
) {
	try {
		let text_output = '';
		let currentBlock: string | null = null;
		let first_block_index = 0;
		let current_block_indexes = [0, 0];
		const all_block_indexes: { [key: string]: number[] } = {};

		const lines = schema_string.split('\n');

		// Process block indexes
		for (const [index, line] of lines.entries()) {
			if (currentBlock) {
				// Mark the end of current block if at the end of the file
				if (lines.length - 1 === index) {
					current_block_indexes[1] = index;
					all_block_indexes[currentBlock] = [...current_block_indexes];
				}
			}

			if (line.startsWith('// ===== ')) {
				const current_block_name = line.split('=====')[1].trim();

				if (currentBlock) {
					if (currentBlock !== current_block_name) {
						current_block_indexes[1] = index;
						all_block_indexes[currentBlock] = [...current_block_indexes];
					}
					currentBlock = null;
				}

				if (!currentBlock) {
					if (Object.entries(all_block_indexes).length === 0) {
						first_block_index = index;
					}
					current_block_indexes[0] = index;
					currentBlock = current_block_name;
				}
			}
		}

		// Add init types (shared pocketbase types)
		const init_types = lines.slice(0, first_block_index);
		text_output = init_types.join('\n') + '\n';

		// Prepare filter keywords
		const filter_keywords = collection_keywords_to_filter
			? collection_keywords_to_filter.split(',').map((k) => k.trim())
			: [];

		// Process other blocks
		const all_block_indexes_array = Object.entries(all_block_indexes);

		for (const [key, value] of all_block_indexes_array) {
			// Skip Schema block
			if (key === 'Schema') continue;

			// Determine if this block should be included
			const shouldIncludeBlock =
				!collection_keywords_to_filter ||
				key.startsWith('_') ||
				filter_keywords.some((keyword) =>
					key.toLowerCase().includes(keyword.toLowerCase())
				);

			if (shouldIncludeBlock) {
				const block_lines = lines.slice(value[0], value[1]);

				// Add block delimiter and lines
				text_output += `// ===== ${key} block =====\n`;
				text_output += block_lines.join('\n') + '\n';
			}
		}

		// Add the Schema block
		const schema_block = all_block_indexes.Schema;

		if (schema_block) {
			const schema_lines = lines.slice(schema_block[0], schema_block[1]);
			const filtered_schema_lines = [];

			for (const line of schema_lines) {
				const collection_name = line.replace('\t', '').split(':')[0].trim();

				// Include if:
				// 1. No filter specified (include everything)
				// 2. Collection name starts with '_'
				// 3. Collection name matches any filter keyword
				const shouldInclude =
					!collection_keywords_to_filter ||
					collection_name.startsWith('_') ||
					filter_keywords.some((keyword) =>
						collection_name.toLowerCase().includes(keyword.toLowerCase())
					);

				// Include the line if it should be included or if it's a structural line
				if (shouldInclude || line.includes('{') || line.includes('}')) {
					filtered_schema_lines.push(line);
				}
			}

			// Ensure the schema block is properly closed
			if (
				!filtered_schema_lines[filtered_schema_lines.length - 1].includes('}')
			) {
				filtered_schema_lines.push('}');
			}

			if (filtered_schema_lines[0].includes('export type Schema = {')) {
				filtered_schema_lines.unshift('// ===== Schema =====');
			}

			text_output += filtered_schema_lines.join('\n');
		}

		return { text_output, all_block_indexes, first_block_index };
	} catch (error) {
		throw error;
	}
}
