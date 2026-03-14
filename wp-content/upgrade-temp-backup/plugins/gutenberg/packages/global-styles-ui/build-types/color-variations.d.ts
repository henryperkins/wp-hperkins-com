/**
 * WordPress dependencies
 */
import type { GlobalStylesConfig } from '@wordpress/global-styles-engine';
export interface ColorVariationsProps {
    value: GlobalStylesConfig;
    baseValue: GlobalStylesConfig;
    onChange: (config: GlobalStylesConfig) => void;
    title?: string;
    gap?: number;
}
/**
 * Render Global Styles Color Variations.
 *
 * @example
 * ```tsx
 * <ColorVariations
 *   value={userConfig}
 *   baseValue={baseConfig}
 *   onChange={setUserConfig}
 *   title="Palettes"
 *   gap={3}
 * />
 * ```
 */
export declare const ColorVariations: React.ComponentType<ColorVariationsProps>;
//# sourceMappingURL=color-variations.d.ts.map