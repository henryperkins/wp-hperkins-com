import type { StyleVariation } from '@wordpress/global-styles-engine';
/**
 * Hook to get and set style values with memoization.
 *
 * @param path               The path to the style value.
 * @param blockName          The name of the block, if applicable.
 * @param readFrom           Which source to read from: "base" (theme), "user" (customizations), or "merged" (final result).
 * @param shouldDecodeEncode Whether to decode and encode the style value.
 * @return An array containing the style value and a function to set the style
 * value.
 *
 * @example
 * const [ color, setColor ] = useStyle<string>( 'color.text', 'core/button', 'merged' );
 */
export declare function useStyle<T = any>(path: string, blockName?: string, readFrom?: 'base' | 'user' | 'merged', shouldDecodeEncode?: boolean): readonly [T | undefined, (newValue: T | undefined) => void];
/**
 * Hook to get and set setting values with memoization.
 *
 * @param path      The path to the setting value.
 * @param blockName The name of the block, if applicable.
 * @param readFrom  Which source to read from: "base" (theme), "user" (customizations), or "merged" (final result).
 * @return An array containing the setting value and a function to set the
 * setting value.
 *
 * @example
 * const [ fontSize, setFontSize ] = useSetting<string>( 'fontSize', 'core/button', 'merged' );
 */
export declare function useSetting<T = any>(path: string, blockName?: string, readFrom?: 'base' | 'user' | 'merged'): readonly [T, (newValue: T | undefined) => void];
/**
 * Fetches the current theme style variations that contain only the specified properties
 * and merges them with the user config.
 * @param properties
 */
export declare function useCurrentMergeThemeStyleVariationsWithUserConfig(properties?: string[]): StyleVariation[];
/**
 * Hook to get color variations using the full Gutenberg implementation.
 */
export declare function useColorVariations(): StyleVariation[];
/**
 * Hook to randomize theme colors using color rotation.
 *
 * @param blockName The name of the block, if applicable.
 * @return Array containing the randomize function if feature is enabled, empty array otherwise.
 */
export declare function useColorRandomizer(blockName?: string): [() => void] | [];
//# sourceMappingURL=hooks.d.ts.map