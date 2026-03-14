/**
 * WordPress dependencies
 */
import type { GlobalStylesConfig } from '@wordpress/global-styles-engine';
export interface StyleVariationsProps {
    value: GlobalStylesConfig;
    baseValue: GlobalStylesConfig;
    onChange: (config: GlobalStylesConfig) => void;
    gap?: number;
}
/**
 * Render Style Variations.
 *
 * @example
 * ```tsx
 * <StyleVariations
 *   value={userConfig}
 *   baseValue={baseConfig}
 *   onChange={setUserConfig}
 *   gap={3}
 * />
 * ```
 */
export declare const StyleVariations: React.ComponentType<StyleVariationsProps>;
//# sourceMappingURL=style-variations.d.ts.map