import type { GlobalStylesConfig } from '@wordpress/global-styles-engine';
/**
 * Removes all instances of properties from an object.
 *
 * @param object     The object to remove the properties from.
 * @param properties The properties to remove.
 * @return The modified object.
 */
export declare function removePropertiesFromObject(object: any, properties: string[]): any;
/**
 * Returns a new object, with properties specified in `properties` array.,
 * maintain the original object tree structure.
 * The function is recursive, so it will perform a deep search for the given properties.
 * E.g., the function will return `{ a: { b: { c: { test: 1 } } } }` if the properties are  `[ 'test' ]`.
 *
 * @param object     The object to filter
 * @param properties The properties to filter by
 * @return The merged object.
 */
export declare const filterObjectByProperties: (object: any, properties: string[]) => any;
/**
 * Compares a style variation to the same variation filtered by the specified properties.
 * Returns true if the variation contains only the properties specified.
 *
 * @param variation  The variation to compare.
 * @param properties The properties to compare.
 * @return Whether the variation contains only the specified properties.
 */
export declare function isVariationWithProperties(variation: GlobalStylesConfig, properties: string[]): boolean;
/**
 * Extracts font families from a theme JSON configuration.
 *
 * @param themeJson The theme JSON configuration
 * @return Array containing [bodyFontFamily, headingFontFamily]
 */
export declare function getFontFamilies(themeJson: any): [any, any];
export declare function formatFontFamily(input: string): string;
/**
 * Gets the preview style for a font family.
 *
 * @param family The font family object
 * @return CSS style object for the font family
 */
export declare function getFamilyPreviewStyle(family: any): React.CSSProperties;
/**
 * Iterates through the presets array and searches for slugs that start with the specified
 * slugPrefix followed by a numerical suffix. It identifies the highest numerical suffix found
 * and returns one greater than the highest found suffix, ensuring that the new index is unique.
 *
 * @param presets    The array of preset objects, each potentially containing a slug property.
 * @param slugPrefix The prefix to look for in the preset slugs.
 *
 * @return The next available index for a preset with the specified slug prefix, or 1 if no matching slugs are found.
 */
/**
 * Gets the variation class name for a block style variation.
 *
 * @param variation The variation name.
 * @return The variation class name.
 */
export declare function getVariationClassName(variation: string): string;
export declare function getNewIndexFromPresets(presets: any[], slugPrefix: string): number;
//# sourceMappingURL=utils.d.ts.map