/**
 * Internal dependencies
 */
import type { BlockExample, StyleBookCategory, CategoryExamples } from './types';
/**
 * Returns category examples for a given category definition and list of examples.
 * @param {StyleBookCategory} categoryDefinition The category definition.
 * @param {BlockExample[]}    examples           An array of block examples.
 * @return {CategoryExamples|undefined} An object containing the category examples.
 */
export declare function getExamplesByCategory(categoryDefinition: StyleBookCategory, examples: BlockExample[]): CategoryExamples | undefined;
/**
 * Returns category examples for a given category definition and list of examples.
 *
 * @return {StyleBookCategory[]} An array of top-level category definitions.
 */
export declare function getTopLevelStyleBookCategories(): StyleBookCategory[];
//# sourceMappingURL=categories.d.ts.map