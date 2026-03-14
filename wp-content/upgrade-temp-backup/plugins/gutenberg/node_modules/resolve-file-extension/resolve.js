import { parse, resolve } from 'path';
import { opendir } from 'fs/promises';

/**
 * Given a base file name and optional file extensions constraint, returns a promise which resolves
 * to the first file path matching that base name and extension, or undefined if no file could be
 * found. Extensions should be provided with a leading dot (".").
 *
 * @example
 * ```js
 * import { getFilePath } from 'resolve-file-extension';
 *
 * await getFilePath('./example', ['.js', '.json']);
 * // "/path/to/example.js"
 * ```
 *
 * @param {string} baseFile Base file name.
 * @param {string[]=} extensions Optional file extensions to limit.
 *
 * @return {Promise<string|undefined>}
 */
export async function getFilePath(baseFile, extensions) {
	const { base: baseFileName, dir: baseDir } = parse(baseFile);
	const entries = await opendir(baseDir);
	for await (const entry of entries) {
		if (entry.isFile()) {
			const { name, ext } = parse(entry.name);
			if (name === baseFileName && (!extensions || extensions.includes(ext))) {
				return resolve(baseDir, entry.name);
			}
		}
	}
}
