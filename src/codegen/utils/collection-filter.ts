import { Collection } from "../types.js";

export function filterCollectionsByPatterns(
	collections: Collection[],
	ignorePattern?: string,
	includePattern?: string
): Collection[] {
	return collections.filter((collection) => {
		const name = collection.name;

		// If includePattern is specified, collection must match it
		if (includePattern) {
			const includeRegex = new RegExp(includePattern);
			if (!includeRegex.test(name)) {
				return false;
			}
		}

		// If ignorePattern is specified, collection must NOT match it
		if (ignorePattern) {
			const ignoreRegex = new RegExp(ignorePattern);
			if (ignoreRegex.test(name)) {
				return false;
			}
		}

		return true;
	});
}
